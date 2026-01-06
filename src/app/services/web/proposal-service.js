import { Op } from "sequelize";
import { paginate } from "../../../utils/pagination.js";
import AdCampaignIgbAccountUser from "../../models/AdCampaignIgbAccountUser.js";
import AdCampaignState from "../../models/AdCampaignState.js";
import IgbAccount from "../../models/IgbAccount.js";
import IgProfileAverageInsights from "../../models/IgProfileAverageInsights.js";

class ProposalService {
    async proposalsWithState(req, state) {
        const { page, pagesize, offset } = paginate(req.query);
        let sortBy = req?.query?.sort || 'followers_count';

        let { rows, count } = await AdCampaignIgbAccountUser.scope(state).findAndCountAll({
            limit: pagesize,
            offset,
            attributes: ['id', 'created_at', 'ad_campaign_state_id'],
            where: {
                ad_campaign_id: req.params.id
            },
            order: [
                [
                    { model: IgbAccount, as: 'igb_account' },
                    { model: IgProfileAverageInsights, as: 'profile_average_insights' },
                    sortBy,
                    'DESC'
                ]
            ],
            include: [
                {
                    model: IgbAccount,
                    as: 'igb_account',
                    attributes: ['id', 'name', 'username', 'profile_picture_url'],
                    include: [
                        {
                            model: IgProfileAverageInsights,
                            as: 'profile_average_insights',
                        }
                    ]
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