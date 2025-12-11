import { Op } from "sequelize";
import models from "../../models/index.js";
import TokenService from "./token-service.js";
import IgbAccount from "../../models/IgbAccount.js";
import { ApiError } from "../../../utils/api-response.js";

const { User } = models;

class UserService {
    constructor() {
        this.tokenService = new TokenService;
    }

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

    async getById(fb_user_id) {
        return await User.scope('influencer').findOne({
            where: {
                fb_user_id: fb_user_id
            }
        })
    }

    async getUserIgbAccount(req) {
        let account = await IgbAccount.scope('withUser').findOne({
            where: {
                user_id: req.user.id,
                instagram_account_id: req.params.igb_account_id
            }
        })

        if (!account) {
            throw new ApiError(404, 'Igb Account not found');
        }

        return account;
    }
}

export default new UserService;