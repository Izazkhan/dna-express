import { literal } from "sequelize";
import IgbAccount from "../../models/IgbAccount.js";
import IgProfileAverageInsights from "../../models/IgProfileAverageInsights.js";
import { paginate } from "../../../utils/pagination.js";

export class InfluencerService {
    async list(req) {
        const { page, pagesize, offset } = paginate(req.query);
        const userId = Number(req.user.id);
        if (isNaN(userId)) throw new Error('Invalid user id');

        let { rows, count } = await IgbAccount.findAndCountAll({
            limit: pagesize,
            offset,
            include: [
                {
                    model: IgProfileAverageInsights,
                    as: 'profile_average_insights',
                }
            ],
            where: literal(`
                EXISTS (
                    SELECT 1 FROM ad_campaign_igb_account_user AS matches
                    where matches.igb_account_id = "IgbAccount".id
                    AND matches.ad_campaign_state_id >= (SELECT id FROM ad_campaign_states WHERE slug = 'offered')
                    AND EXISTS (
                        SELECT 1 FROM ad_campaigns AS ac
                        where ac.id = matches.ad_campaign_id
                        AND ac.user_id = ${userId}
                    )
                )
            `)
        });

        return {
            igb_accounts: rows,
            pagination: {
                page,
                pagesize,
                total: count,
                totalPages: Math.ceil(count / pagesize)
            }
        };
    }
}

export default new InfluencerService;