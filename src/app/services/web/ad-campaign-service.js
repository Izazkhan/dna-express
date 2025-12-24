import { paginate } from "../../../utils/pagination.js";
import AdCampaignLocation from "../../models/AdCampaignLocation.js";
import { sequelize } from "../../../config/database.js";
import AdCampaignDemographicAgeRanges from "../../models/AdCampaignDemographicAgeRanges.js";
import { literal, Op } from "sequelize";
import AdCampaignState from "../../models/AdCampaignState.js";
import AdCampaignIgbAccountUser from "../../models/AdCampaignIgbAccountUser.js";
import AdCampaignDemographic from "../../models/AdCampaignDemographic.js";
import AdCampaign from "../../models/AdCampaign.js";

class AdCampaignService {

    constructor() { }

    async create({ body: data, user: authUser }) {
        data.user_id = authUser.id;
        const transformed = this.transformRequestData(data);
        return await AdCampaign.create(transformed, {
            include: [{
                model: AdCampaignDemographic,
                as: 'demographics',
                include: 'age_range_ids'
            }, 'locations', 'user']
        });
    }

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
            console.log('transformed', transformed.demographics);
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
            return this.transformCampaignResponseData(updatedCampaign);
        });
    }

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

    async getWithDetail(req, id) {
        let campaign = await AdCampaign.findByPk(id, {
            where: {
                user_id: req.user.id
            },
            include: [{
                model: AdCampaignDemographic,
                include: 'age_ranges',
                as: 'demographics'
            },
            {
                model: AdCampaignLocation, as: 'locations',
                include: ['city', 'state', 'country']
            }
                , 'deliverable', 'engagement_rate'
            ]
        });

        if (!campaign) {
            return null;
        }

        return this.transformCampaignResponseData(campaign);
    }

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

    async fetchCampaignsWithProposalScope(req, proposalScope) {
        const { pagesize, offset } = paginate(req.query);

        let { rows, count } = await AdCampaign
            .scope(['openCampaigns', proposalScope])
            .findAndCountAll({
                where: {
                    user_id: req.user.id
                },
                attributes: ['id', 'name', 'created_at'],
                limit: pagesize,
                offset,
                order: [['created_at', 'DESC']]
            });
        return {
            campaigns: rows,
            count
        }
    }

    transformCampaignsResponseData(campaigns) {
        return campaigns.map(campaign => this.transformCampaignResponseData(campaign));
    }

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