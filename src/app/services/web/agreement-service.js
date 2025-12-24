import { Op } from "sequelize";
import AdCampaign from "../../models/AdCampaign.js";
import AdCampaignIgbAccountUser from "../../models/AdCampaignIgbAccountUser.js";
import AdCampaignState from "../../models/AdCampaignState.js";
import IgbAccount from "../../models/IgbAccount.js";
import IgProfileAverageInsights from "../../models/IgProfileAverageInsights.js";

class AgreementService {
    constructor() {
        // Initialization code here
    }

    index = async (req) => {
        let { rows, count } = await IgbAccount.findAndCountAll({
            distinct: true,
            include: [
                {
                    model: AdCampaignIgbAccountUser,
                    as: 'matches',
                    attributes: [],
                    where: {
                        // accepted
                        ad_campaign_state_id: {
                            [Op.and]: [
                                { [Op.gte]: await AdCampaignState.offeredId() },
                                { [Op.lt]: await AdCampaignState.completedId() },
                            ]
                        }
                    },
                    include: [{
                        model: AdCampaign,
                        as: 'ad_campaign',
                        where: {
                            publish_until: {
                                [Op.or]: [
                                    { [Op.lte]: new Date() },
                                    null
                                ]
                            },
                            user_id: req.user.id,
                        }
                    }]
                }
            ]
        })
        return {
            agreements: rows,
            total: count
        };
    }

}
export default new AgreementService;