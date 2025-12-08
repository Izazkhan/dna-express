import asyncHandler from '../../utils/async-handler.js';
import IgbAccount from '../models/IgbAccount.js';
import User from '../models/User.js';
import TokenService from '../services/app-api/token-service.js';

class AppAuthMiddleware {
    constructor() {
        this.tokenService = new TokenService(); // Instance state if needed
    }

    handle = asyncHandler(async (req, res, next) => {
        let encodedBearer;
        if (req.headers.authorization?.startsWith('Bearer')) {
            encodedBearer = req.headers.authorization.split(' ')[1];
        }

        if (!encodedBearer) {
            throw new ApiError(401, 'Bearer token required');
        }

        const { fbUserId, plainAccessToken } = this.#decodeBearer(encodedBearer); // Private method

        const user = await User.findOne({ where: { fb_user_id: fbUserId } });
        if (!user) throw new ApiError(401, 'User not found');

        let decryptedStored;
        try {
            // Fetch encrypted from linked table if needed
            const igbAccount = await IgbAccount.findOne({ where: { user_id: user.id } });
            if (!igbAccount) throw new Error('No IGB account');
            decryptedStored = this.tokenService.decrypt(igbAccount.access_token);
        } catch (error) {
            throw new ApiError(401, 'Stored token invalid');
        }

        if (decryptedStored !== plainAccessToken) {
            throw new ApiError(401, 'Token mismatch');
        }

        req.user = { id: user.id, fb_user_id: fbUserId, access_token: plainAccessToken };
        next();
    });

    // Private helper (class benefit: encapsulation)
    #decodeBearer(encoded) {
        const bundleString = Buffer.from(encoded, 'base64').toString('utf8');
        const [fbUserId, plainAccessToken] = bundleString.split(':');
        if (!fbUserId || !plainAccessToken) throw new Error('Invalid format');
        return { fbUserId, plainAccessToken };
    }
}

export default new AppAuthMiddleware;