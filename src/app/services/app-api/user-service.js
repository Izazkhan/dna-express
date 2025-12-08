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
}

export default new UserService;