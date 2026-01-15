import { literal, Op } from "sequelize";
import IgbAccount from "../../models/IgbAccount.js";
import IgProfileAverageInsights from "../../models/IgProfileAverageInsights.js";
import { paginate } from "../../../utils/pagination.js";
import { sequelize } from "../../../config/database.js";
import IgPost from "../../models/IgPost.js";
import AdCampaignIgbAccountUser from "../../models/AdCampaignIgbAccountUser.js";
import { StateIds } from "../../../config/campaign-states.js";

/**
 * Service handling business logic for influencer discovery and media management within the web portal.
 */
export class InfluencerService {
    /**
     * @method list
     * @description Retrieves a paginated list of influencers matched with the authenticated user's campaigns.
     * @param {import('express').Request} req - Request object containing user context and query filters.
     * @returns {Promise<Object>} Object containing IGB accounts and pagination metadata.
     */
    async list(req) {
        const { page, pagesize, offset } = paginate(req.query);
        const userId = Number(req.user.id);
        if (isNaN(userId)) throw new Error('Invalid user id');

        // 1. Campaign check
        const whereConditions = [
            sequelize.literal(`
                EXISTS (
                    SELECT 1 FROM ad_campaign_igb_account_user AS matches
                    WHERE matches.igb_account_id = "IgbAccount".id
                    AND matches.ad_campaign_state_id >= ${StateIds.matched}
                    AND EXISTS (
                        SELECT 1 FROM ad_campaigns AS ac
                        WHERE ac.id = matches.ad_campaign_id
                        AND ac.user_id = :userId
                    )
                )
            `)
        ];

        const replacements = { userId };

        // 2. ONLY add the search logic if a term actually exists
        if (req.query.search && req.query.search.trim() !== '') {
            whereConditions.push(
                sequelize.literal(`(
                    lower("IgbAccount".username) LIKE :search 
                    OR lower("IgbAccount".name) LIKE :search
                )`)
            );
            replacements.search = `${req.query.search}%`;
        }

        let { rows, count } = await IgbAccount.findAndCountAll({
            limit: pagesize,
            offset,
            include: [
                {
                    model: IgProfileAverageInsights,
                    as: 'profile_average_insights',
                }
            ],
            where: {
                [Op.and]: whereConditions
            },
            replacements: replacements
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

    /**
     * @method media
     * @description Retrieves paginated Instagram posts for a specific influencer account.
     * @param {import('express').Request} req - Request object containing pagination query.
     * @param {number|string} igbAccountId - The internal ID of the IGB account.
     * @returns {Promise<Object|string>} Paginated posts or an error message if no match is found.
     */
    async media(req, igbAccountId) {
        const { page, pagesize, offset } = paginate(req.query);
        let match = await AdCampaignIgbAccountUser.findOne({
            where: {
                igb_account_id: igbAccountId
            }
        })

        if (!match) {
            return "Failed to find campaign match with infleuncer"
        }

        let { rows, count } = await IgPost.findAndCountAll({
            offset,
            limit: pagesize,
            where: {
                igb_account_id: igbAccountId
            },
            order: [['created_at', 'DESC']]
        })
        return {
            posts: rows,
            pagination: {
                page,
                pagesize,
                total: count,
                totalPages: Math.ceil(count / pagesize)
            }
        }
    }
}

export default new InfluencerService;