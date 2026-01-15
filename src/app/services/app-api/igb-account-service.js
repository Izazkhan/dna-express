import { ApiError } from "../../../utils/api-response.js";
import IgbAccount from "../../models/IgbAccount.js";
import models from "../../models/index.js";
import TokenService from "./token-service.js";

const { User } = models;

/**
 * Service handling the business logic for IGB account synchronization and creation.
 */
class IgbAccountService {
    constructor() {
    }

    /**
     * @method create
     * @description Creates or updates an IGB account record linked to a Facebook user ID.
     * @param {Object} data - The account data to be saved or updated.
     * @param {string|number} fb_user_id - The Facebook user ID used to associate the account with a system user.
     * @returns {Promise<IgbAccount>} The persisted IGB account instance with user details.
     */
    async create(data, fb_user_id) {
        let user = await User.findOne({ where: { fb_user_id } });
        if (!user) {
            throw new ApiError(404, 'Associated user not found');
        }
        data.user_id = user.id;
        let account = await IgbAccount.findOne({ where: { instagram_account_id: data.instagram_account_id } });
        if (!account) {
            account = await IgbAccount.create(data);
        } else {
            await account.update(data);
        }
        return await IgbAccount.scope(['withUser']).findByPk(account.id);
    }
}

export default new IgbAccountService;