import { ApiResponse } from "../../../utils/api-response.js";
import asyncHandler from "../../../utils/async-handler.js";
import IgbAccountService from "../../services/app-api/igb-account-service.js";

/**
 * Controller handling IGB account registration and management.
 */
class IgbAccountsController {
    constructor() {
        this.service = IgbAccountService;
    }

    /**
     * @method create
     * @description Registers a new IGB account using Facebook user data and request body.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    create = asyncHandler(async (req, res) => {
        let response = await this.service.create(req.body, req.params.fb_user_id);
        return res.status(200).json(new ApiResponse('User has been successfully registered', response));
    });
}

export default new IgbAccountsController;