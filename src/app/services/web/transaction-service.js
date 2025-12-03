import AdCampaignTransaction from "../../models/AdCampaignTransaction.js";

class TransactionService {
    create(data) {
        return AdCampaignTransaction.create(data);
    }

    getById(id) {
        return AdCampaignTransaction.findByPk(id);
    }
}

export default new TransactionService();