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
            return { success: true, newMatches: totalMatches, totalCampaigns: openCampaigns.length };
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

        // Find new matches (eligible igb accounts)
        const eligibleAccounts = await sequelize.query(`
                    SELECT 
                    ia.id AS igb_account_id,
                    ia.username,
                    ia.name,
                    pai.engagement,
                    pai.likes,
                    pai.followers_count,
                    ldi.percent_male,
                    ldi.percent_female
                    
                    FROM igb_accounts AS ia
                    JOIN ig_profile_average_insights AS pai ON pai.igb_account_id = ia.id
                    LEFT JOIN ig_latest_demographic_insights as ldi ON ldi.igb_account_id = ia.id
                    WHERE ia.is_active = true 
                    AND pai.engagement BETWEEN :lower_engagement AND :upper_engagement
                    AND pai.likes >= :likes_min
                    AND pai.followers_count >= :followers_min
                    AND (
                        :use_gender = false
                        OR (
                            ldi.percent_male >= :percent_male
                            AND ldi.percent_female >= :percent_female
                        )
                    )
                    AND NOT EXISTS (
                        SELECT 1
                        FROM ad_campaign_igb_account_user acu
                        WHERE acu.igb_account_id = ia.id
                        AND acu.ad_campaign_id = :campaign_id
                    )
                `, {
            replacements: {
                lower_engagement: campaign.engagement_rate?.lower,
                upper_engagement: campaign.engagement_rate?.upper,
                percent_male: campaign.demographics.percent_female,
                percent_female: campaign.demographics.percent_female,
                campaign_id: campaign.id,
                use_gender: campaign.demographics?.use_gender,
                likes_min: campaign.likes_min,
                followers_min: campaign.follower_min
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
