import { ApiResponse } from "../../../../utils/api-response.js";
import asyncHandler from "../../../../utils/async-handler.js";
import InfluencerService from "../../../services/app-api/adcampaign/influencer-service.js";

class InfluencerController {
    constructor() {
        this.service = InfluencerService;
    }

    acceptCampaign = asyncHandler(async (req, res) => {
        return res.status(200).json(new ApiResponse('accept campaign', await this.service.acceptCampaign(req)));
    });
    
    rejectCampaign = asyncHandler(async (req, res) => {
        return res.status(200).json(new ApiResponse('reject campaign', await this.service.rejectCampaign(req)));
    });

    feed = asyncHandler(async (req, res) => {
        return res.status(200).json(new ApiResponse('Feed api', await this.service.feed(req)));
    });
}

export default new InfluencerController;