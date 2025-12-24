import { Op } from "sequelize";
import { paginate } from "../../../utils/pagination.js";
import AdCampaignIgbAccountUser from "../../models/AdCampaignIgbAccountUser.js";
import AdCampaignState from "../../models/AdCampaignState.js";
import IgbAccount from "../../models/IgbAccount.js";

class ProposalService {
    async proposalsWithState(req, state) {
        const { page, pagesize, offset } = paginate(req.query);


        let { rows, count } = await AdCampaignIgbAccountUser.scope(state).findAndCountAll({
            limit: pagesize,
            offset,
            attributes: ['id', 'created_at', 'ad_campaign_state_id'],
            where: {
                ad_campaign_id: req.params.id
            },
            include: [
                {
                    model: IgbAccount,
                    as: 'igb_account',
                    attributes: ['id', 'name', 'username', 'profile_picture_url'],
                }
            ]
        })

        return {
            proposals: rows,
            pagination: {
                page,
                pagesize,
                total: count,
                totalPages: Math.ceil(count / pagesize)
            }
        };
    }
}

export default new ProposalService;