import { ApiResponse } from "../../../../utils/api-response.js";
import asyncHandler from "../../../../utils/async-handler.js";
import InfluencerService from "../../../services/app-api/adcampaign/influencer-service.js";

class InfluencerController {
    constructor() {
        this.service = InfluencerService;
    }

    acceptCampaign = asyncHandler(async (req, res) => {
        return res.status(200).json(new ApiResponse('accept campaign', await this.service.acceptCampaign(req.params.ad_campaign_id, req.params.igb_account_id)));
    });
}

export default new InfluencerController;