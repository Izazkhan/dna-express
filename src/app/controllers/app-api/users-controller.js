import { ApiResponse } from "../../../utils/api-response.js";
import asyncHandler from "../../../utils/async-handler.js";
import UserService from "../../services/app-api/user-service.js";

class UsersController {
    constructor() {
        this.service = UserService
    }

    create = asyncHandler(async (req, res) => {
        let response = await this.service.create(req.body);
        res.status(200).json(new ApiResponse('User has been successfully registered', response));
    });
}

export default new UsersController;