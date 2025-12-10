import { ApiResponse } from "../../../utils/api-response.js";
import asyncHandler from "../../../utils/async-handler.js";
import IgPostService from "../../services/app-api/ig-post-service.js";

class PostsController {
    constructor() {
        this.service = new IgPostService;
    }

    getTopPosts = asyncHandler(async (req, res) => {
        console.log("Here?");
        res.status(200).json(new ApiResponse('Posts', await this.service.getTopPosts(req)));
    })
}

export default new PostsController;