import { ApiResponse } from "../../../utils/api-response.js";
import asyncHandler from "../../../utils/async-handler.js";
import InfluencerService from "../../services/web/influencer-service.js";

/**
 * Controller handling influencer filtering and media retrieval based on campaign status.
 */
export class InfluencersController {
    constructor() {
        this.service = InfluencerService;
    }

    /**
     * @method list
     * @description Retrieves the general list of influencers associated with campaigns.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    list = asyncHandler(async (req, res) => {
        let result = await this.service.list(req);
        res.status(200).json(new ApiResponse('Influencers list', result));
    })

    /**
     * @method accepted
     * @description Retrieves influencers who have accepted campaign offers.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    accepted = asyncHandler(async (req, res) => {
        let result = await this.service.accepted(req);
        res.status(200).json(new ApiResponse('Influencers list (accepted)', result));
    })

    /**
     * @method active
     * @description Retrieves influencers currently participating in active campaigns.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    active = asyncHandler(async (req, res) => {
        let result = await this.service.active(req);
        res.status(200).json(new ApiResponse('Influencers list (active)', result));
    })

    /**
     * @method rejected
     * @description Retrieves influencers who have been rejected or have declined offers.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    rejected = asyncHandler(async (req, res) => {
        let result = await this.service.rejected(req);
        res.status(200).json(new ApiResponse('Influencers list (rejected)', result));
    })

    /**
     * @method archived
     * @description Retrieves influencers from archived campaign records.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    archived = asyncHandler(async (req, res) => {
        let result = await this.service.archived(req);
        res.status(200).json(new ApiResponse('Influencers list (archived)', result));
    })

    /**
     * @method posts
     * @description Retrieves social media posts for a specific IGB account.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    posts = asyncHandler(async (req, res) => {
        let result = await this.service.media(req, req.params.igb_account_id);
        res.status(200).json(new ApiResponse('Infleuncer Posts', result));
    })
}

// Instantiate and export default for easy import
export default new InfluencersController();