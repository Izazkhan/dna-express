import { Op } from 'sequelize';
import models from '../models/index.js';

const {
    AdCampaign,
    AdCampaignDemographic,
    AdCampaignEngagementRange,
    IgbAccount,
    IgProfileInsights,
    IgProfileAverageInsights,
    AdCampaignIgbAccountUser,
    IgLatestDemographicInsights
} = models;

class MatcherService {
    constructor() { }

    /**
     * Runs matcher for all active campaigns
     */
    async run() {
        try {
            console.log('🔍 Starting campaign matcher...');

            // Step 1: Fetch active campaigns
            const now = new Date();
            const openCampaigns = await AdCampaign.findAll({
                where: {
                    publish_from: { [Op.lte]: now },
                    [Op.or]: [
                        { publish_until: null },
                        { publish_until: { [Op.gte]: now } }
                    ],
                    matcher_run_at: null,
                    // published: true,
                    archived: false
                },
                include: [
                    {
                        model: AdCampaignDemographic,
                        as: 'demographics',
                        required: false,
                    },
                    {
                        model: AdCampaignEngagementRange,
                        as: 'engagement_rate',
                        required: false,
                    },
                ],
            });

            console.log(`📋 Found ${openCampaigns.length} active campaigns`);

            let totalMatches = 0;

            for (const campaign of openCampaigns) {
                console.log(`\n🎯 Matching campaign: ${campaign.id} - ${campaign.name || 'Untitled'}`);
                const matches = await this.matchCampaign(campaign);
                // campaign.matcher_run_at = new Date();
                if (matches.length > 0) {
                    // campaign.is_matching = true;
                }
                // await campaign.save();
                totalMatches += matches;
                // return { ac: campaign };
                console.log(`   ✅ Found ${matches} matches for campaign ${campaign.id}`);
            }

            console.log(`\n🎉 Matching complete! Total matches: ${totalMatches}`);
            return { success: true, totalMatches };
        } catch (err) {
            console.error('❌ Error in MatcherService.run:', err);
            throw err;
        }
    }

    /**
     * Matches a single campaign to eligible IGB accounts
     * @param {AdCampaign} campaign
     */
    async matchCampaign(campaign) {
        const includeClause = [
            // {
            //     model: IgProfileInsights,
            //     as: 'profile_insights',
            //     required: true,
            // },
            {
                model: IgProfileAverageInsights,
                as: 'profile_average_insights',
                required: false, // only apply filters if engagementRange exists
            }
        ];

        const whereClause = { is_active: true }; // Only active IGB accounts

        // --- Demographics Filtering ---
        const demographics = campaign.demographics; // assuming single demographic
        if (demographics) {
            const followerFilters = {};

            if (campaign.follower_min) followerFilters[Op.gte] = campaign.follower_min;
            if (campaign.follower_max) followerFilters[Op.lte] = campaign.follower_max;

            if (Object.keys(followerFilters).length > 0) {
                includeClause[0].where = { followers_count: followerFilters };
            }

            // Gender filters
            if (demographics.use_gender) {
                const minFemale = demographics.percent_female || 0;
                const minMale = demographics.percent_male || 0;
                includeClause.push({
                    model: IgLatestDemographicInsights,
                    as: 'demographics',
                    where: {
                        [Op.or]: [
                            { percent_female: { [Op.gte]: minFemale } },
                            { percent_male: { [Op.gte]: minMale } }
                        ],
                    },
                    required: true
                });
            }
        }

        // --- Engagement Filtering ---
        const engagementRange = campaign.engagement_rate;
        if (engagementRange) {
            const engagementWhere = {};
            if (campaign.likes_min) engagementWhere.likes = { [Op.gte]: campaign.likes_min };

            if (engagementRange.lower) engagementWhere.engagement = { [Op.gte]: engagementRange.lower };
            if (engagementRange.upper) engagementWhere.engagement = { ...(engagementWhere.engagement || {}), [Op.lte]: engagementRange.upper };
            console.log(engagementWhere, campaign.toJSON());
            if (Object.keys(engagementWhere).length > 0) {
                includeClause.push({
                    model: IgProfileAverageInsights,
                    as: 'profile_average_insights',
                    where: engagementWhere,
                    required: true
                });
            }
        }

        // Step 3: Find eligible accounts
        const eligibleAccounts = await IgbAccount.findAll({
            where: whereClause,
            include: includeClause,
        });


        if (!eligibleAccounts.length) return 0;

        // Step 4: Avoid duplicate matches
        const existingMatches = await AdCampaignIgbAccountUser.findAll({
            where: { ad_campaign_id: campaign.id },
            attributes: ['igb_account_id']
        });
        const existingIds = new Set(existingMatches.map(m => m.igb_account_id));

        const newMatches = eligibleAccounts
            .filter(acc => !existingIds.has(acc.id))
            .map(acc => ({
                ad_campaign_id: campaign.id,
                igb_account_id: acc.id,
                ad_campaign_state_id: 1, // matched
            }));

        if (newMatches.length) {
            // await AdCampaignIgbAccountUser.bulkCreate(newMatches);
        }

        return newMatches.length;
    }

    /**
     * Match a single campaign by ID
     * @param {number} campaignId
     */
    async matchSingleCampaign(campaignId) {
        const campaign = await AdCampaign.findByPk(campaignId, {
            include: [
                { model: AdCampaignDemographic, as: 'demographics', required: false },
                { model: AdCampaignEngagementRange, as: 'engagement_rate', required: false },
            ]
        });

        if (!campaign) throw new Error(`Campaign ${campaignId} not found`);

        const matches = await this.matchCampaign(campaign);
        return { success: true, matches };
    }
}

export default new MatcherService();
