import { ApiResponse } from "../../../utils/api-response.js";
import asyncHandler from "../../../utils/async-handler.js";
import UserService from "../../services/app-api/user-service.js";

/**
 * Controller handling user registration, authentication retrieval, and account lookups.
 */
class UsersController {
    constructor() {
        this.service = UserService;
    }

    /**
     * @method create
     * @description Registers a new user in the system.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    create = asyncHandler(async (req, res) => {
        let response = await this.service.create(req.body);
        res.status(200).json(new ApiResponse('User has been successfully registered', response));
    });

    /**
     * @method getAuthUser
     * @description Returns the currently authenticated user from the request object.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    getAuthUser = asyncHandler(async (req, res) => {
        return res.status(200).json(new ApiResponse("User retrieved", req.user));
    });

    /**
     * @method getByIgbAccountId
     * @description Retrieves user details associated with a specific IGB account ID.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    getByIgbAccountId = asyncHandler(async (req, res) => {
        let response = await this.service.getUserIgbAccount(req);
        return res.status(200).json(new ApiResponse("Account retrieved", response));
    });
}

export default new UsersController;