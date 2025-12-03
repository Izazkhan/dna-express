import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { ApiError } from '../../utils/api-response.js';
import asyncHandler from '../../utils/async-handler.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;
    console.log('Authorization Header:', req.headers.authorization);
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new ApiError(401, 'Not authorized to access this route');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        if (!req.user) {
            throw new ApiError(401, 'User not found');
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
        };

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

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, `Role ${req.user.role} is not authorized`);
        }
        next();
    };
};