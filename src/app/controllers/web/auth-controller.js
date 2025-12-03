// controllers/AuthController.js
import asyncHandler from '../../../utils/async-handler.js';
import { ApiResponse } from '../../../utils/api-response.js';
import AuthService from '../../services/web/auth-service.js';

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

    // REGISTER USER
    register = asyncHandler(async (req, res) => {
        const result = await AuthService.register(req.body);

        res.cookie('refreshToken', result.refreshToken, this.cookieOptions);
        delete result.refreshToken;

        res.status(201).json(new ApiResponse('User registered successfully', result));
    });

    // LOGIN USER
    login = asyncHandler(async (req, res) => {
        const result = await AuthService.login(req.body);

        res.cookie('refreshToken', result.refreshToken, this.cookieOptions);
        delete result.refreshToken;

        res.status(200).json(new ApiResponse('Login successful', result));
    });

    // LOGOUT USER
    logout = asyncHandler(async (req, res) => {
        res.clearCookie('refreshToken', this.cookieOptions);
        res.status(200).json(new ApiResponse('Logout successful'));
    });

    // REFRESH ACCESS TOKEN
    refreshToken = asyncHandler(async (req, res) => {
        const result = await AuthService.refreshToken(req.cookies.refreshToken);

        res.cookie('refreshToken', result.refreshToken, this.cookieOptions);
        delete result.refreshToken;

        res.status(200).json(new ApiResponse('Token refreshed', result));
    });

    // RESET PASSWORD (with token)
    resetPassword = asyncHandler(async (req, res) => {
        await AuthService.resetPassword(req.body);
        res.status(200).json(new ApiResponse('Password reset successful'));
    });

    // FORGOT PASSWORD (send email)
    forgotPassword = asyncHandler(async (req, res) => {
        const { email } = req.body;
        const result = await AuthService.forgotPassword(email);
        res.status(200).json(new ApiResponse('Password reset email sent', result));
    });
}

export default new AuthController();