import { ApiResponse } from "../../../utils/api-response.js";
import asyncHandler from "../../../utils/async-handler.js";
import UserService from "../../services/app-api/user-service.js";

class UsersController {
    constructor() {
        this.service = UserService
    }

    create = asyncHandler(async (req, res) => {
        let response = await this.service.create(req);
        res.status(200).json(new ApiResponse('message', response));
    });
}

export default new UsersController;