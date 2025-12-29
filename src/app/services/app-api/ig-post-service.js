import { literal } from "sequelize";
import { paginate } from "../../../utils/pagination.js";
import IgbAccount from "../../models/IgbAccount.js";
import IgPost from "../../models/IgPost.js";

class IgPostService {
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