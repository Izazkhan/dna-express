import { ApiError } from "../../../../utils/api-response.js";
import models from "../../../models/index.js";
const { IgbAccount } = models;

class InfluencerService {
    async acceptCampaign(adCampaignId, igbAccountId) {
        return {
            adCampaignId, igbAccountId
        };
    }
}

export default new InfluencerService;