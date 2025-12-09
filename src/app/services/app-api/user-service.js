import { Op } from "sequelize";
import { User } from "../../models/index.js";
import TokenService from "./token-service.js";

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
}

export default new UserService;