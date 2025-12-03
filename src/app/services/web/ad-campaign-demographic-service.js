import AdCampaignDemographic from "../../models/AdCampaignDemographic.js";
import AdCampaignDemographicAgeRanges from "../../models/AdCampaignDemographicAgeRanges.js";

// services/DemographicService.js
class DemographicService {
    async createDemographicWithAgeRanges(campaignId, demographicData, transaction = null) {
        const t = transaction || await sequelize.transaction();
        try {
            // Create demographic linked to campaign
            const demographic = await AdCampaignDemographic.create(
                { ...demographicData, ad_campaign_id: campaignId },
                { transaction: t }
            );

            // Link age ranges via junction table
            if (demographicData.age_range_ids?.length > 0) {
                const ageRangeLinks = demographicData.age_range_ids.map(ageRangeId => ({
                    ad_campaign_demographic_id: demographic.id,
                    age_range_id: ageRangeId
                }));
                await AdCampaignDemographicAgeRanges.bulkCreate(ageRangeLinks, { transaction: t });
            }

            if (!transaction) await t.commit();
            return demographic;
        } catch (error) {
            if (!transaction) await t.rollback();
            throw error;
        }
    }
}

export default new DemographicService();