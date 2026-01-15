import { Op } from "sequelize";
import models from "../../models/index.js";
import TokenService from "./token-service.js";
import IgbAccount from "../../models/IgbAccount.js";
import { ApiError } from "../../../utils/api-response.js";

const { User } = models;

/**
 * Service handling user profile management, secure token storage, and account associations.
 */
class UserService {
    constructor() {
        this.tokenService = new TokenService;
    }

    /**
     * @method create
     * @description Creates a new user or updates an existing one with encrypted Facebook access tokens.
     * @param {Object} params
     * @param {string} params.fb_user_id - Unique Facebook user identifier.
     * @param {string} params.access_token - Raw Facebook access token to be encrypted.
     * @param {string} params.email - User email address.
     * @returns {Promise<Object>} The persisted user instance.
     */
    async create({ fb_user_id, access_token, email }) {
        let user = await User.findOne({ where: { fb_user_id } });
        let encryptedToken = this.tokenService.encrypt(access_token);
        if (!user) {
            user = await User.create({
                fb_user_id,
                email,
                access_token: encryptedToken
            });
        } else {
            user = await user.update({
                email,
                access_token: encryptedToken
            });
        }

        return {
            user: user
        };
    }

    /**
     * @method getById
     * @description Retrieves a user by their Facebook ID using the 'influencer' scope.
     * @param {string} fb_user_id
     * @returns {Promise<User|null>}
     */
    async getById(fb_user_id) {
        return await User.scope('influencer').findOne({
            where: {
                fb_user_id: fb_user_id
            }
        })
    }

    /**
     * @method getUserIgbAccount
     * @description Finds a specific IGB account associated with the authenticated user.
     * @param {import('express').Request} req - Request object containing user context and account ID.
     * @returns {Promise<IgbAccount>}
     * @throws {ApiError} If the account is not found.
     */
    async getUserIgbAccount(req) {
        let account = await IgbAccount.scope('withUser').findOne({
            where: {
                user_id: req.user.id,
                instagram_account_id: req.params.igb_account_id
            }
        })

        if (!account) {
            throw new ApiError(404, 'Igb account not found');
        }

        return account;
    }
}

export default new UserService;