import { literal } from "sequelize";
import { paginate } from "../../../utils/pagination.js";
import IgbAccount from "../../models/IgbAccount.js";
import IgPost from "../../models/IgPost.js";

/**
 * Service handling business logic for Instagram post retrieval and filtering.
 */
class IgPostService {
    /**
     * @method getTopPosts
     * @description Retrieves a paginated list of posts for a specific IGB account.
     * @param {Object} req - The request object containing query parameters and route params.
     * @returns {Promise<Array>} A promise that resolves to an array of IgPost instances.
     */
    async getTopPosts(req) {
        let { pagesize, offset } = paginate(req.query);
        return await IgPost.findAll({
            limit: pagesize,
            offset,
            include: [{
                model: IgbAccount,
                as: 'igb_account',
                where: { instagram_account_id: req.params.igb_account_id },
                attributes: []
            }]
        });
    }
}

export default new IgPostService;