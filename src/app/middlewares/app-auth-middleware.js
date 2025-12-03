import { ApiError } from '../../utils/api-response.js';
import asyncHandler from '../../utils/async-handler.js';
import { User } from '../models/index.js';

export const appProtect = asyncHandler(async (req, res, next) => {
    let encodedToken;
    if (req.headers.authorization?.startsWith('Bearer')) {
        encodedToken = req.headers.authorization.split(' ')[1];
    }

    if (!encodedToken) {
        throw new ApiError(401, 'App access token required');
    }

    try {
        // Step 1: Base64 decode the token (fb_user_id:access_token)
        const decodedString = Buffer.from(encodedToken, 'base64').toString('utf-8');
        const [fbUserId, accessToken] = decodedString.split(':');

        if (!fbUserId || !accessToken) {
            throw new ApiError(401, 'Invalid token format');
        }

        // Step 2: Find user by fb_user_id
        const user = await User.findOne({ where: { fb_user_id: fbUserId } });
        if (!user) {
            throw new ApiError(401, 'User not found');
        }

        // Step 3: Verify stored access_token matches (for tamper-proofing; skip if not needed)
        if (user.access_token !== accessToken) {
            throw new ApiError(401, 'Token mismatch');
        }

        // Step 4: Set req.user with essentials
        req.user = {
            id: user.id,
            fb_user_id: user.fb_user_id,
            username: user.username,
            // Add more fields as needed (e.g., role if applicable)
        };

        next();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(401, 'Authentication failed');
    }
});