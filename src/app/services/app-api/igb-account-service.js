import { ApiError } from "../../../utils/api-response.js";
import IgbAccount from "../../models/IgbAccount.js";
import { User } from "../../models/index.js";
import TokenService from "./token-service.js";

class IgbAccountService {
    constructor() {
    }

    async create(data, fb_user_id) {
        // let user = await User.findOne({ where: { fb_user_id } });
        // if (!user) {
        //     throw new ApiError(404, 'Associated user not found');
        // }
        // data.user_id = user.id;
        // let account = await IgbAccount.findOne({ where: { instagram_account_id: data.instagram_account_id } });
        // if (!account) {
        //     account = await IgbAccount.create(data);
        // } else {
        //     await account.update(data);
        // }
        // return await User.findByPk(1, {include: 'igb_accounts'});
        return await IgbAccount.findByPk(1);
    }
}

export default new IgbAccountService;