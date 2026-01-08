import { literal, Op } from "sequelize";
import IgbAccount from "../../models/IgbAccount.js";
import IgProfileAverageInsights from "../../models/IgProfileAverageInsights.js";
import { paginate } from "../../../utils/pagination.js";
import { sequelize } from "../../../config/database.js";
import IgPost from "../../models/IgPost.js";
import AdCampaignIgbAccountUser from "../../models/AdCampaignIgbAccountUser.js";

export class InfluencerService {
    /* List influencers associated with the user's ad campaigns */
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
                    AND matches.ad_campaign_state_id >= (SELECT id FROM ad_campaign_states WHERE slug = 'matched')
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