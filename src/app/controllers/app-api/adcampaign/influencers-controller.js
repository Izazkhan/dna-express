import { ApiResponse } from "../../../../utils/api-response.js";
import asyncHandler from "../../../../utils/async-handler.js";
import InfluencerService from "../../../services/app-api/adcampaign/influencer-service.js";

/**
 * Controller handling influencer-specific campaign actions and feeds.
 */
class InfluencerController {
    constructor() {
        this.service = InfluencerService;
    }

    /**
     * @method acceptCampaign
     * @description Handles the request to accept an ad campaign.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    acceptCampaign = asyncHandler(async (req, res) => {
        return res.status(200).json(new ApiResponse('accept campaign', await this.service.acceptCampaign(req)));
    });
    
    /**
     * @method rejectCampaign
     * @description Handles the request to reject an ad campaign.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    rejectCampaign = asyncHandler(async (req, res) => {
        return res.status(200).json(new ApiResponse('reject campaign', await this.service.rejectCampaign(req)));
    });

    /**
     * @method feed
     * @description Retrieves the influencer's personalized campaign feed.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    feed = asyncHandler(async (req, res) => {
        return res.status(200).json(new ApiResponse('Feed api', await this.service.feed(req)));
    });
}

export default new InfluencerController;