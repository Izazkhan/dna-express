import { ApiResponse } from "../../../utils/api-response.js";
import asyncHandler from "../../../utils/async-handler.js";
import ProposalService from "../../services/web/proposal-service.js";

/**
 * Controller handling the filtering and retrieval of influencer proposals based on their current state.
 */
export class InfluencersController {
    constructor() {
        this.service = ProposalService;
    }

    /**
     * @method active
     * @description Retrieves proposals that are currently in an active state.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    active = asyncHandler(async (req, res) => {
        let result = await this.service.proposalsWithState(req, 'withActiveState');
        res.status(200).json(new ApiResponse('Active Proposals', result));
    })

    /**
     * @method accepted
     * @description Retrieves proposals that have been accepted.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    accepted = asyncHandler(async (req, res) => {
        let result = await this.service.proposalsWithState(req, 'withAcceptedState');
        res.status(200).json(new ApiResponse('Accepted Proposals', result));
    })

    /**
     * @method rejected
     * @description Retrieves proposals that have been rejected.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    rejected = asyncHandler(async (req, res) => {
        let result = await this.service.proposalsWithState(req, 'withRejectedState');
        res.status(200).json(new ApiResponse('Rejected Proposals', result));
    })

    /**
     * @method completed
     * @description Retrieves proposals that have reached a completed state.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    completed = asyncHandler(async (req, res) => {
        let result = await this.service.proposalsWithState(req, 'withCompletedState');
        res.status(200).json(new ApiResponse('Completed Proposals', result));
    })
}

// Instantiate and export default for easy import
export default new InfluencersController();