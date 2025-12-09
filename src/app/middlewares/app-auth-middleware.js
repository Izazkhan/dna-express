import { ApiError } from '../../utils/api-response.js';
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

        const user = await User.scope('withTokens').findOne({ where: { fb_user_id: fbUserId } });
        if (!user) throw new ApiError(401, 'User not found');

        let decryptedStored;
        try {
            decryptedStored = this.tokenService.decrypt(user.access_token);
        } catch (error) {
            throw new ApiError(401, 'Stored token invalid');
        }

        if (decryptedStored != plainAccessToken) {
            console.log('decrypted', decryptedStored, plainAccessToken);

            throw new ApiError(401, 'Token mismatch');
        }
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