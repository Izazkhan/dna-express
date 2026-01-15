import { ApiResponse } from "../../../utils/api-response.js";
import asyncHandler from "../../../utils/async-handler.js";
import IgPostService from "../../services/app-api/ig-post-service.js";

/**
 * Controller handling retrieval and management of Instagram posts.
 */
class PostsController {
    constructor() {
        this.service = IgPostService;
    }

    /**
     * @method getTopPosts
     * @description Retrieves the top-performing Instagram posts based on engagement or reach.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    getTopPosts = asyncHandler(async (req, res) => {
        res.status(200).json(new ApiResponse('Posts', await this.service.getTopPosts(req)));
    })
}

export default new PostsController;