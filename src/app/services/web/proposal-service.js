import { Op } from "sequelize";
import { paginate } from "../../../utils/pagination.js";
import AdCampaignIgbAccountUser from "../../models/AdCampaignIgbAccountUser.js";
import AdCampaignState from "../../models/AdCampaignState.js";
import IgbAccount from "../../models/IgbAccount.js";
import IgProfileAverageInsights from "../../models/IgProfileAverageInsights.js";

/**
 * Service handling the retrieval and filtering of influencer proposals 
 * associated with specific ad campaigns.
 */
class ProposalService {
    /**
     * @method proposalsWithState
     * @description Fetches a paginated list of proposals for a campaign, filtered by a specific 
     * Sequelize scope (state) and sorted by influencer performance metrics.
     * @param {import('express').Request} req - Request object containing query params (page, sort) and campaign ID.
     * @param {string} state - The Sequelize scope name representing the campaign state (e.g., 'withActiveState').
     * @returns {Promise<Object>} Object containing the list of proposals and pagination metadata.
     */
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