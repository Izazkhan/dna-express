import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { ApiError } from '../../utils/api-response.js';
import asyncHandler from '../../utils/async-handler.js';

class AuthMiddleware {

    handle = asyncHandler(async (req, res, next) => {
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new ApiError(401, 'Not authorized to access this route');
        }

        try {
            console.log("Here???");
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findByPk(decoded.id);

            if (!req.user) {
                throw new ApiError(401, 'User not found');
            }

            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                throw new ApiError(401, 'Invalid token');
            }
            if (error.name === 'TokenExpiredError') {
                throw new ApiError(401, 'Token expired');
            }
            throw error;
        }
    });
}

export default new AuthMiddleware;