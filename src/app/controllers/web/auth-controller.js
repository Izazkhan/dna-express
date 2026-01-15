// controllers/AuthController.js
import asyncHandler from '../../../utils/async-handler.js';
import { ApiResponse } from '../../../utils/api-response.js';
import AuthService from '../../services/web/auth-service.js';

/**
 * Controller handling user authentication, session management, and password recovery.
 */
class AuthController {
    constructor() {
        // Cookie options (secure in production)
        this.cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };
    }

    /**
     * @method register
     * @description Handles user registration and sets the initial refresh token cookie.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    register = asyncHandler(async (req, res) => {
        const result = await AuthService.register(req.body);

        res.cookie('refreshToken', result.refreshToken, this.cookieOptions);
        delete result.refreshToken;

        return res.status(201).json(new ApiResponse('User registered successfully', result));
    });

    /**
     * @method login
     * @description Authenticates user credentials and issues session cookies.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    login = asyncHandler(async (req, res) => {
        const result = await AuthService.login(req.body);

        res.cookie('refreshToken', result.refreshToken, this.cookieOptions);
        delete result.refreshToken;

        return res.status(200).json(new ApiResponse('Login successful', result));
    });

    /**
     * @method logout
     * @description Clears the authentication cookies to end the user session.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    logout = asyncHandler(async (req, res) => {
        res.clearCookie('refreshToken', this.cookieOptions);
        return res.status(200).json(new ApiResponse('Logout successful'));
    });

    /**
     * @method refreshToken
     * @description Validates the current refresh token and issues a new access/refresh token pair.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    refreshToken = asyncHandler(async (req, res) => {
        console.log("HEre?", req.body, req.cookies.refreshToken);
        const result = await AuthService.refreshToken(req.cookies.refreshToken);

        res.cookie('refreshToken', result.refreshToken, this.cookieOptions);
        delete result.refreshToken;

        return res.status(200).json(new ApiResponse('Token refreshed', result));
    });

    /**
     * @method resetPassword
     * @description Updates the user password using a valid reset token.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    resetPassword = asyncHandler(async (req, res) => {
        await AuthService.resetPassword(req.body);
        return res.status(200).json(new ApiResponse('Password reset successful'));
    });

    /**
     * @method forgotPassword
     * @description Initiates the password recovery process by sending a reset email.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    forgotPassword = asyncHandler(async (req, res) => {
        const { email } = req.body;
        const result = await AuthService.forgotPassword(email);
        return res.status(200).json(new ApiResponse('Password reset email sent', result));
    });
}

export default new AuthController();