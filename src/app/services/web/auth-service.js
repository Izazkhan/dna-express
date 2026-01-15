// services/AuthService.js
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import models from '../../models/index.js';
import { ApiError } from '../../../utils/api-response.js';
import PasswordResetMail from '../../mails/password-reset-mail.js';
import { Op } from 'sequelize';
const { User, PasswordReset } = models;
import { sendMail } from '../../../mail.js';

/**
 * Service handling user authentication, registration, token management, and password recovery logic.
 */
class AuthService {
    constructor() {
        this.JWT_EXPIRE = process.env.JWT_EXPIRE || '15m';
        this.JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';
        this.PASSWORD_RESET_EXPIRY = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * @private
     * @description Generates a new pair of Access and Refresh JWTs for a user.
     * @param {number} userId 
     * @returns {{accessToken: string, refreshToken: string}}
     */
    #generateTokens(userId) {
        const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRE,
        });
        const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: this.JWT_REFRESH_EXPIRE,
        });
        return { accessToken, refreshToken };
    }

    /**
     * @private
     * @description Hashes a token string for secure database storage using bcrypt.
     * @param {string} token 
     * @returns {Promise<string>}
     */
    async #hashToken(token) {
        return await bcrypt.hash(token, 10);
    }

    /**
     * @method register
     * @description Registers a new user, hashes their password, and issues initial authentication tokens.
     * @param {Object} params
     * @param {string} params.email
     * @param {string} params.password
     * @param {string} params.name
     * @returns {Promise<Object>} User data and token pair.
     */
    async register({ email, password, name }) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) throw new ApiError(400, 'User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, name });

        const { accessToken, refreshToken } = this.#generateTokens(user.id);
        await user.update({ refresh_token: await this.#hashToken(refreshToken) });

        await this.#sendWelcomeEmail(email, name);

        return {
            user: user,
            accessToken,
            refreshToken,
        };
    }

    /**
     * @method login
     * @description Validates user credentials and generates a new session with tokens.
     * @param {Object} params
     * @param {string} params.email
     * @param {string} params.password
     * @returns {Promise<Object>} Minimal user data and token pair.
     */
    async login({ email, password }) {
        const user = await User.findOne({
            where: { email },
            attributes: ['id', 'email', 'name', 'password'],
        });

        if (!user) throw new ApiError(401, 'Invalid credentials');

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new ApiError(401, 'Invalid credentials');

        const { accessToken, refreshToken } = this.#generateTokens(user.id);
        await user.update({
            last_login: new Date(),
            refresh_token: await this.#hashToken(refreshToken),
        });

        return {
            user: { id: user.id, email: user.email, name: user.name },
            accessToken,
            refreshToken,
        };
    }

    /**
     * @private
     * @description Sends a welcome email notification to a newly registered user.
     * @param {string} email 
     * @param {string} name 
     */
    async #sendWelcomeEmail(email, name) {
        const subject = 'Welcome to Our Platform!';
        const html = `<h1>Hello ${name}!</h1><p>Welcome aboard.</p>`;
        await sendMail(email, subject, html);
    }

    /**
     * @method forgotPassword
     * @description Generates a password reset token, stores its hash, and emails the reset link.
     * @param {string} email 
     * @returns {Promise<{link: string}>}
     */
    async forgotPassword(email) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new ApiError(404, 'User not found');

        const token = crypto.randomBytes(20).toString('hex');
        const expiresIn = Date.now() + this.PASSWORD_RESET_EXPIRY;

        await PasswordReset.destroy({ where: { user_id: user.id } });
        await PasswordReset.create({
            user_id: user.id,
            token: await this.#hashToken(token),
            expires_in: expiresIn,
        });

        const link = `${process.env.FRONTEND_URL}/password-reset?token=${token}&email=${encodeURIComponent(email)}`;
        const mailable = PasswordResetMail(user.name, link);
        await sendMail(user.email, 'Password Reset', mailable);

        return { link };
    }

    /**
     * @method resetPassword
     * @description Verifies a reset token and updates the user's password.
     * @param {Object} params
     * @param {string} params.token - The raw reset token.
     * @param {string} params.email
     * @param {string} params.password - The new password.
     * @returns {Promise<{message: string}>}
     */
    async resetPassword({ token, email, password }) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new ApiError(404, 'User not found');

        const record = await PasswordReset.findOne({
            where: {
                user_id: user.id,
                expires_in: { [Op.gt]: new Date() },
            },
        });

        if (!record) throw new ApiError(400, 'Invalid or expired token');

        const isMatch = await bcrypt.compare(token, record.token);
        if (!isMatch) throw new ApiError(400, 'Invalid token');

        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({ password: hashedPassword });
        await record.destroy();

        return { message: 'Password reset successful' };
    }

    /**
     * @method refreshToken
     * @description Validates a refresh token and rotates it with a new access/refresh pair.
     * @param {string} refreshToken 
     * @returns {Promise<{accessToken: string, refreshToken: string}>}
     */
    async refreshToken(refreshToken) {
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            throw new ApiError(401, 'Invalid or expired refresh token');
        }

        const user = await User.findOne({
            // fb_user_id null means only advertisers
            where: { id: decoded.id, fb_user_id: null },
            attributes: ['id', 'refresh_token'],
        });

        if (!user || !user?.refresh_token) {
            throw new ApiError(401, 'User not found');
        }

        const isTokenValid = await bcrypt.compare(refreshToken, user.refresh_token);
        if (!isTokenValid) throw new ApiError(401, 'Invalid token');

        const { accessToken, refreshToken: newRefreshToken } = this.#generateTokens(user.id);
        await user.update({ refresh_token: await this.#hashToken(newRefreshToken) });

        return { accessToken, refreshToken: newRefreshToken };
    }
}

export default new AuthService();