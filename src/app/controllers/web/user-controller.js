// controllers/web-api/UserAuthController.js
import asyncHandler from '../../../utils/async-handler.js';
import { ApiError, ApiResponse } from '../../../utils/api-response.js';
import UserService from '../../services/web/user-service.js';
import AuthService from '../../services/web/auth-service.js';

class UserAuthController {
    constructor() {
        this.service = UserService;
    }
    // GET current authenticated user
    getMe = asyncHandler(async (req, res) => {
        res.status(200).json(new ApiResponse('User retrieved', req.user));
    });

    // Update authenticated user
    updateMe = asyncHandler(async (req, res) => {
        const updates = req.body;
        const result = await this.service.updateUser(req.user.id, updates);
        res.status(200).json(new ApiResponse('User updated', result));
    });

    // Delete authenticated user
    deleteMe = asyncHandler(async (req, res) => {
        await this.service.deleteUser(req.user.id);
        await AuthService.logout(req, res); // clear session/token
        res.status(200).json(new ApiResponse('Account deleted'));
    });

    getUserById = asyncHandler(async (req, res) => {
        const user = await this.service.getUserById(req.params.id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        res.status(200).json(new ApiResponse('User retrieved', user));
    });

    // Delete user by ID
    deleteUser = asyncHandler(async (req, res) => {
        await this.service.deleteUser(req.params.id);
        res.status(200).json(new ApiResponse('User deleted'));
    });
}

export default new UserAuthController();