import { ApiResponse } from "../../../utils/api-response.js";
import asyncHandler from "../../../utils/async-handler.js";
import ProposalService from "../../services/web/proposal-service.js";

export class InfluencersController {
    constructor() {
        this.service = ProposalService;
    }
    
    active = asyncHandler(async (req, res) => {
        let result = await this.service.proposalsWithState(req, 'withActiveState');
        res.status(200).json(new ApiResponse('Active Proposals', result));
    })
    
    accepted = asyncHandler(async (req, res) => {
        let result = await this.service.proposalsWithState(req, 'withAcceptedState');
        res.status(200).json(new ApiResponse('Accepted Proposals', result));
    })
    
    rejected = asyncHandler(async (req, res) => {
        let result = await this.service.proposalsWithState(req, 'withRejectedState');
        res.status(200).json(new ApiResponse('Rejected Proposals', result));
    })
    
    completed = asyncHandler(async (req, res) => {
        let result = await this.service.proposalsWithState(req, 'withCompletedState');
        res.status(200).json(new ApiResponse('Completed Proposals', result));
    })
}

// Instantiate and export default for easy import
export default new InfluencersController();