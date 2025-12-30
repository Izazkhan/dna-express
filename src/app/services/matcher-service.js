import { Op } from 'sequelize';
import models from '../models/index.js';
import { sequelize } from '../../config/database.js';

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
                    'locations'
                ],
            });

            let totalMatches = 0;
            for (const campaign of openCampaigns) {
                const matches = await this.matchCampaign(campaign);
                campaign.matcher_run_at = new Date();
                if (matches.length > 0) {
                    campaign.is_matching = true;
                }
                await campaign.save();
                totalMatches += matches;
            }
            console.log(`New matches: ${totalMatches}`)
            return {
                success: true,
                newMatches: totalMatches,
                totalOpenCampaigns: openCampaigns.length
            }
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

        let sql = `
            SELECT 
                ia.id AS igb_account_id,
                ia.username,
                ia.name,
                pai.engagement,
                pai.likes,
                pai.followers_count,
                ldi.percent_male,
                ldi.percent_female,
                -- Aggregate directly at the top level
                SUM(lacc.value) AS audience_value 
                            
            FROM igb_accounts AS ia
            
            -- INNER JOINs ensure we only get accounts with existing insights
            JOIN ig_profile_average_insights AS pai ON pai.igb_account_id = ia.id
            
            -- LEFT JOIN ensures we don't lose accounts just because they lack demographic data
            LEFT JOIN ig_latest_demographic_insights AS ldi ON ldi.igb_account_id = ia.id
            
            -- Flattened Join: Filter directly on this table
            JOIN ig_latest_audience_city_counts AS lacc
                ON lacc.igb_account_id = ia.id
            
            LEFT JOIN ad_campaign_igb_account_user AS acu 
                ON acu.igb_account_id = ia.id AND acu.ad_campaign_id = :campaign_id
            
            WHERE ia.is_active = true
        `;

        if (campaign?.locations?.[0]?.data_city_id) {
            // 1. Location Filtering (City)
            sql += ` AND lacc.data_city_id = :city_id`;
        } else {
            // Fallback to State if City not provided
            sql += ` AND lacc.data_state_id = :state_id`;
        }

        // 2. Engagement & Metrics Filtering
        sql += `
                AND pai.engagement BETWEEN :lower_engagement AND :upper_engagement
                AND pai.likes >= :likes_min
                AND pai.followers_count >= :followers_min
            `;

        if (campaign.demographics?.use_gender === true) {
            // 3. Gender Filtering
            sql += `
                    AND ldi.percent_male >= :percent_male
                    AND ldi.percent_female >= :percent_female
                `;
        }

        sql += `
                AND acu.igb_account_id IS NULL
                -- 5. Required grouping for aggregate SUM
                GROUP BY 
                    ia.id, 
                    ia.username, 
                    ia.name,
                `;
        if (campaign?.locations?.[0]?.data_city_id) {
            sql += ` lacc.data_city_id,`;
        } else {
            sql += ` lacc.data_state_id,`;
        }
        // make it unique for account (avoid duplicate rows)
        sql += ` pai.id, ldi.id`;
        // Find new matches (eligible igb accounts)
        const eligibleAccounts = await sequelize.query(sql, {
            replacements: {
                lower_engagement: campaign.engagement_rate?.lower,
                upper_engagement: campaign.engagement_rate?.upper,
                percent_male: campaign.demographics.percent_female,
                percent_female: campaign.demographics.percent_female,
                campaign_id: campaign.id,
                use_gender: campaign.demographics?.use_gender,
                likes_min: campaign.likes_min,
                followers_min: campaign.follower_min,
                city_id: campaign?.locations?.[0]?.data_city_id || null,
                state_id: campaign?.locations?.[0]?.data_state_id || null,
                country_id: campaign?.locations?.[0]?.data_country_id || null
            },
            type: 'SELECT'
        });

        let newMatches = eligibleAccounts.map(match => ({
            ad_campaign_id: campaign.id,
            igb_account_id: match.igb_account_id,
            ad_campaign_state_id: 1
        }))
        if (newMatches.length) {
            await AdCampaignIgbAccountUser.bulkCreate(newMatches);
        }

        return newMatches.length;
    }
}

export default new MatcherService();
