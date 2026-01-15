// controllers/web-api/UserAuthController.js
import asyncHandler from '../../../utils/async-handler.js';
import { ApiError, ApiResponse } from '../../../utils/api-response.js';
import UserService from '../../services/web/user-service.js';
import AuthService from '../../services/web/auth-service.js';

/**
 * Controller handling authenticated user profile management and administrative user actions.
 */
class UserAuthController {
    constructor() {
        this.service = UserService;
    }

    /**
     * @method getMe
     * @description Retrieves the profile details of the currently authenticated user.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    getMe = asyncHandler(async (req, res) => {
        return res.status(200).json(new ApiResponse('User retrieved', req.user));
    });

    /**
     * @method updateMe
     * @description Updates the profile information of the currently authenticated user.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    updateMe = asyncHandler(async (req, res) => {
        const updates = req.body;
        const result = await this.service.updateUser(req.user.id, updates);
        return res.status(200).json(new ApiResponse('User updated', result));
    });

    /**
     * @method deleteMe
     * @description Deletes the authenticated user's account and terminates their session.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    deleteMe = asyncHandler(async (req, res) => {
        await this.service.deleteUser(req.user.id);
        await AuthService.logout(req, res); // clear session/token
        return res.status(200).json(new ApiResponse('Account deleted'));
    });

    /**
     * @method getUserById
     * @description Retrieves detailed information for a specific user by their ID.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    getUserById = asyncHandler(async (req, res) => {
        const user = await this.service.getUserById(req.params.id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        return res.status(200).json(new ApiResponse('User retrieved', user));
    });

    /**
     * @method deleteUser
     * @description Administrative action to delete a user account by its ID.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    deleteUser = asyncHandler(async (req, res) => {
        await this.service.deleteUser(req.params.id);
        return res.status(200).json(new ApiResponse('User deleted'));
    });
}

export default new UserAuthController();