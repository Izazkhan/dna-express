import { paginate } from "../../../utils/pagination.js";
import AdCampaignLocation from "../../models/AdCampaignLocation.js";
import { sequelize } from "../../../config/database.js";
import AdCampaignDemographicAgeRanges from "../../models/AdCampaignDemographicAgeRanges.js";
import { col, fn, literal, Op } from "sequelize";
import AdCampaignState from "../../models/AdCampaignState.js";
import AdCampaignIgbAccountUser from "../../models/AdCampaignIgbAccountUser.js";
import AdCampaignDemographic from "../../models/AdCampaignDemographic.js";
import AdCampaign from "../../models/AdCampaign.js";
import MatcherQueue from "../../../queues/matcher/matcher-queue.js";
import { StateIds } from "../../../config/campaign-states.js";

/**
 * Service handling the core business logic for Ad Campaigns, including creation,
 * updates, insights calculation, and response transformation.
 */
class AdCampaignService {

    constructor() { }

    /**
     * @method create
     * @description Creates a new ad campaign, transforms incoming data, and triggers the matcher queue.
     * @param {Object} params - Object containing body and user.
     * @returns {Promise<AdCampaign>}
     */
    async create({ body: data, user: authUser }) {
        data.user_id = authUser.id;
        const transformed = this.transformRequestData(data);
        let campaign = await AdCampaign.create(transformed, {
            include: [{
                model: AdCampaignDemographic,
                as: 'demographics',
                include: 'age_range_ids'
            }, 'locations', 'user']
        });
        // trigger event
        await MatcherQueue.addJob(campaign.id);
        return campaign;
    }

    /**
     * @method update
     * @description Updates campaign details, demographics, and locations within a transaction.
     * @param {Object} params - Object containing route params, body, and user context.
     * @returns {Promise<Object>} The transformed updated campaign.
     */
    async update({ params, body: data, user: authUser }) {
        const campaignId = params.id;

        return await sequelize.transaction(async (t) => {
            let campaign = await AdCampaign.findByPk(campaignId, { transaction: t });
            if (!campaign || campaign.user_id != authUser.id) {
                throw new Error("Campaign not found or unauthorized");
            }

            const transformed = this.transformRequestData(data);

            await campaign.update(transformed, { transaction: t });

            // Handle demographics update
            if (transformed.demographics) {
                const oldDemographic = await AdCampaignDemographic.findOne({
                    where: { ad_campaign_id: campaignId },
                    transaction: t
                });

                if (oldDemographic) {
                    await AdCampaignDemographicAgeRanges.destroy({
                        where: { ad_campaign_demographic_id: oldDemographic.id },
                        transaction: t
                    });

                    await oldDemographic.destroy({ transaction: t });
                }


                const newDemographics = await AdCampaignDemographic.create({
                    ...transformed.demographics,
                    ad_campaign_id: campaignId
                }, { transaction: t });

                if (transformed.demographics.age_range_ids && transformed.demographics.age_range_ids.length > 0) {
                    const newRows = transformed.demographics.age_range_ids.map(ar => ({
                        ad_campaign_demographic_id: newDemographics.id,
                        age_range_id: ar.age_range_id
                    }));

                    await AdCampaignDemographicAgeRanges.bulkCreate(newRows, { transaction: t });
                }
            }

            // Handle locations update
            if (transformed.locations) {
                // Assuming locations are always replaced for simplicity
                await AdCampaignLocation.destroy({ where: { ad_campaign_id: campaignId }, transaction: t });
                for (const loc of transformed.locations) {
                    await AdCampaignLocation.create({
                        ...loc,
                        ad_campaign_id: campaignId
                    }, { transaction: t });
                }
            }

            // Re-fetch the updated campaign with all associations
            let updatedCampaign = await AdCampaign.findByPk(campaignId, {
                include: [{
                    model: AdCampaignDemographic,
                    as: 'demographics',
                    include: 'age_ranges'
                },
                {
                    model: AdCampaignLocation, as: 'locations',
                    include: ['city', 'state', 'country']
                }, 'user'],
                transaction: t
            });
            await MatcherQueue.addJob(updatedCampaign.id);
            return this.transformCampaignResponseData(updatedCampaign);
        });
    }

    /**
     * @method transformRequestData
     * @description Normalizes incoming request data for demographics and location mapping.
     * @param {Object} data
     * @returns {Object}
     */
    transformRequestData(data) {
        let { demographics, locations, ...rest } = data;

        demographics = {
            ...demographics,
            age_range_ids: demographics?.age_range_ids ?
                demographics.age_range_ids.map(id => ({ age_range_id: id })) : []
        };

        locations = locations?.map(loc => ({
            ...loc,
            data_city_id: loc.city_id,
            data_state_id: loc.state_id,
            data_country_id: loc.country_id,
            radius_miles: loc.radius_miles
        })) || [];

        locations.forEach(loc => {
            delete loc.city_id;
            delete loc.state_id;
            delete loc.country_id;
        });

        if (rest.publish_until === "") {
            rest.publish_until = null;
        }

        return {
            ...rest,
            demographics,
            locations
        };
    }

    /**
     * @method getWithDetail
     * @description Fetches campaign by ID with full relations and performance insights.
     * @param {Object} req
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    async getWithDetail(req, id) {
        let campaign = await AdCampaign.findByPk(id, {
            where: {
                user_id: req.user.id
            },
            include: [
                {
                    model: AdCampaignDemographic,
                    include: 'age_ranges',
                    as: 'demographics'
                },
                {
                    model: AdCampaignLocation, as: 'locations',
                    include: ['city', 'state', 'country']
                }, 'deliverable', 'engagement_rate'
            ]
        });

        if (!campaign) {
            return null;
        }

        campaign = this.transformCampaignResponseData(campaign);
        return {
            campaign,
            insights: await this.getCampaignInsights(id)
        }
    }

    /**
     * @method getCampaignInsights
     * @description Aggregates campaign performance data into a conversion funnel (matches, views, offers, etc.).
     * @param {number} id - Campaign ID.
     * @returns {Promise<Object>}
     */
    async getCampaignInsights(id) {
        const [matchCounts] = await sequelize.query(`
            SELECT COUNT(aiu.id) as count, aiu.ad_campaign_state_id, 
            acs.name,
            SUM(
                CASE
                    WHEN (
                        aiu.ad_campaign_state_id = ${StateIds.matched} 
                        AND aiu.viewed = true
                    ) OR (aiu.ad_campaign_state_id > ${StateIds.matched})
                    THEN 1
                    ELSE 0
                END
            ) as viewed_count
            FROM ad_campaign_igb_account_user aiu
            JOIN ad_campaign_states acs on acs.id = aiu.ad_campaign_state_id
            WHERE aiu.ad_campaign_id = :ad_campaign_id
            GROUP BY aiu.ad_campaign_state_id, acs.name
        `, {
            replacements: {
                ad_campaign_id: id            }
        });

        return matchCounts.reduce((acc, curr) => {
            const name = curr.name.toLowerCase();
            const count = parseInt(curr.count, 10);
            const stateViews = parseInt(curr.viewed_count, 10);

            // 1. Accumulate Views (Independent flag)
            acc.views += stateViews;

            // 2. Accumulated Status Logic (Funnel)
            // If it's Published, it counts for Published + Accepted + Offered + Matched
            if (name.includes('complete') || name.includes('publish')) {
                acc.published += count;
                acc.accepts += count;
                acc.offers += count;
                acc.matches += count;
            }
            // If it's Offered, it counts for Offered + Matched
            else if (name.includes('offer')) {
                acc.accepts += count;
                acc.offers += count;
                acc.matches += count;
            }
            // If it's Accepted, it counts for  Offered + Matched
            else if (name.includes('accept')) {
                acc.offers += count;
                acc.matches += count;
            }
            // If it's just Matched, it only counts for Matched
            else if (name.includes('match')) {
                acc.matches += count;
            }

            return acc;
        }, { matches: 0, views: 0, offers: 0, accepts: 0, published: 0 })
    }

    /**
     * @method getForEditPage
     * @description Fetches a campaign and transforms it for use in front-end edit forms.
     * @param {Object} req
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    async getForEditPage(req, id) {
        let campaign = await AdCampaign.findByPk(id, {
            where: {
                user_id: req.user.id
            },
            include: [
                {
                    model: AdCampaignDemographic,
                    include: 'age_ranges',
                    as: 'demographics'
                },
                {
                    model: AdCampaignLocation, as: 'locations',
                    include: ['city', 'state', 'country']
                }
            ],
            attributes: {
                exclude: [
                    'ad_campaign_payment_type_id',
                ]
            }
        });

        if (!campaign) {
            return null;
        }

        return this.transformCampaignResponseData(campaign);
    }

    /**
     * @method get
     * @description Simple fetch for a single campaign by ID.
     * @param {Object} req
     * @param {number} id
     * @returns {Promise<AdCampaign|null>}
     */
    async get(req, id) {
        let campaign = await AdCampaign.findByPk(id, {
            where: {
                user_id: req.user.id
            }
        });

        if (!campaign) {
            return null;
        }
        return campaign;
    }

    /**
     * @method getAllWithSimplePagination
     * @description Retrieves a paginated list of campaigns for the current user.
     * @param {Object} req
     * @returns {Promise<Object>}
     */
    async getAllWithSimplePagination(req) {
        const { pagesize, offset } = paginate(req.query);
        let campaigns = await AdCampaign.findAll({
            where: {
                user_id: req.user.id
            },
            include: [{
                model: AdCampaignDemographic,
                include: 'age_ranges',
                as: 'demographics'
            }, {
                model: AdCampaignLocation, as: 'locations',
                include: ['city', 'state', 'country']
            }],
            limit: pagesize,
            offset,
            order: [['created_at', 'DESC']]
        });
        campaigns = this.transformCampaignsResponseData(campaigns);
        return {
            campaigns: campaigns
        }
    }

    /**
     * @method fetchCampaignsWithProposalScope
     * @description Fetches campaigns filtered by specific proposal scopes (active, accepted, etc.).
     * @param {Object} req
     * @param {string} proposalScope - The Sequelize scope to apply.
     * @returns {Promise<Object>}
     */
    async fetchCampaignsWithProposalScope(req, proposalScope) {
        const { pagesize, offset, page } = paginate(req.query);
        const whereConditions = {
            user_id: req.user.id
        };
        if (req.query.search) {
            whereConditions.name = { [Op.iLike]: `${req.query.search}%` };
        }
        console.log(proposalScope);
        let { rows, count } = await AdCampaign
            .scope(['openCampaigns', proposalScope])
            .findAndCountAll({
                where: whereConditions,
                attributes: ['id', 'name', 'created_at'],
                limit: pagesize,
                offset,
                order: [['created_at', 'DESC']]
            });
        return {
            campaigns: rows,
            pagination: {
                page,
                pagesize,
                total: count,
                totalPages: Math.ceil(count / pagesize)
            }
        }
    }

    /**
     * @method transformCampaignsResponseData
     * @description Batch transformation of campaign models into plain JSON objects.
     * @param {Array<AdCampaign>} campaigns
     * @returns {Array<Object>}
     */
    transformCampaignsResponseData(campaigns) {
        return campaigns.map(campaign => this.transformCampaignResponseData(campaign));
    }

    /**
     * @method transformCampaignResponseData
     * @description Cleans and formats campaign model data for API responses.
     * @param {AdCampaign} campaign
     * @returns {Object}
     */
    transformCampaignResponseData(campaign) {
        const campaignData = campaign.toJSON();

        if (campaignData.locations) {
            campaignData.locations = campaignData.locations.map(loc => {
                return {
                    city: loc.city ? { id: loc.city.id, name: loc.city.name } : null,
                    state: loc.state ? { id: loc.state.id, name: loc.state.name } : null,
                    country: loc.country ? { id: loc.country.id, name: loc.country.name } : null,
                    radius_miles: loc.radius_miles
                }
            });
        }
        // Transform demographics age_ranges to age_range_ids
        if (campaignData.demographics) {
            campaignData.demographics.age_ranges = campaignData.demographics.age_ranges?.map(ar => {
                return {
                    id: ar.id, name: ar.name
                }
            });
        }

        if (campaignData.engagement_rate) {
            campaignData.engagement_rate = {
                id: campaignData.engagement_rate.id,
                label: campaignData.engagement_rate.label,
            }
        }
        return campaignData;
    }

    /**
     * @method publishCampaign
     * @description Sets the published status of a campaign to true.
     * @param {number} campaignId
     * @returns {Promise<boolean|null>}
     */
    async publishCampaign(campaignId) {
        let campaign = await AdCampaign.findByPk(campaignId);
        if (!campaign) {
            return null;
        }
        campaign.update({
            published: true
        })
        return true;
    }
}

export default new AdCampaignService();