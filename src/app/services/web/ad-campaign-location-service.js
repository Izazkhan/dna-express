// services/LocationService.js
/**
 * Service handling the creation and management of campaign-specific geographic target locations.
 */
class LocationService {
    /**
     * @method createLocation
     * @description Persists location targeting data for a specific campaign within a transaction.
     * @param {number} campaignId - The ID of the campaign to link the location to.
     * @param {Object} locationsData - Geographic data (e.g., city, state, country IDs).
     * @param {Object|null} [transaction] - Optional existing Sequelize transaction.
     * @returns {Promise<Object>} The created location record.
     * @throws {Error} If the database operation fails.
     */
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