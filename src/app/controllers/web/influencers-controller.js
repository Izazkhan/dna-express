import { ApiResponse } from "../../../utils/api-response.js";
import asyncHandler from "../../../utils/async-handler.js";
import InfluencerService from "../../services/web/influencer-service.js";

export class InfluencersController {
    constructor() {
        this.service = InfluencerService;
    }

    list = asyncHandler(async (req, res) => {
        let result = await this.service.list(req);
        res.status(200).json(new ApiResponse('Influencers list', result));
    })

    accepted = asyncHandler(async (req, res) => {
        let result = await this.service.accepted(req);
        res.status(200).json(new ApiResponse('Influencers list (accepted)', result));
    })
    
    active = asyncHandler(async (req, res) => {
        let result = await this.service.active(req);
        res.status(200).json(new ApiResponse('Influencers list (active)', result));
    })

    rejected = asyncHandler(async (req, res) => {
        let result = await this.service.rejected(req);
        res.status(200).json(new ApiResponse('Influencers list (rejected)', result));
    })

    archived = asyncHandler(async (req, res) => {
        let result = await this.service.archived(req);
        res.status(200).json(new ApiResponse('Influencers list (archived)', result));
    })
}

// Instantiate and export default for easy import
export default new InfluencersController();