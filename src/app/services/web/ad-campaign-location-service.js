
// services/LocationService.js
class LocationService {
    async createLocation(campaignId, locationsData, transaction = null) {
        const t = transaction || await sequelize.transaction();
        try {
            // Create demographic linked to campaign
            const location = await AdCampaignLocation.create(
                { ...locationsData, ad_campaign_id: campaignId },
                { transaction: t }
            );
            if (!transaction) await t.commit();
            return location;
        } catch (error) {
            if (!transaction) await t.rollback();
            throw error;
        }
    }
}

export default new LocationService();