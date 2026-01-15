import AdCampaignTransaction from "../../models/AdCampaignTransaction.js";

/**
 * Service handling the persistence and retrieval of ad campaign financial transactions.
 */
class TransactionService {
    /**
     * @method create
     * @description Creates a new transaction record for an ad campaign.
     * @param {Object} data - The transaction details (amount, status, campaign ID, etc.).
     * @returns {Promise<AdCampaignTransaction>} The created transaction instance.
     */
    create(data) {
        return AdCampaignTransaction.create(data);
    }

    /**
     * @method getById
     * @description Retrieves a specific transaction by its primary key.
     * @param {number|string} id - The transaction ID.
     * @returns {Promise<AdCampaignTransaction|null>} The transaction instance or null if not found.
     */
    getById(id) {
        return AdCampaignTransaction.findByPk(id);
    }
}

export default new TransactionService();