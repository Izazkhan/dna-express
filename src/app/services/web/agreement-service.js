import { Op } from "sequelize";
import AdCampaign from "../../models/AdCampaign.js";
import AdCampaignIgbAccountUser from "../../models/AdCampaignIgbAccountUser.js";
import AdCampaignState from "../../models/AdCampaignState.js";
import IgbAccount from "../../models/IgbAccount.js";
import IgProfileAverageInsights from "../../models/IgProfileAverageInsights.js";

class AgreementService {

    index = async (req, type = 'active') => {
        const isCompleted = type === 'completed';
        const offeredId = await AdCampaignState.offeredId();
        const completedId = await AdCampaignState.completedId();

        const stateCondition = isCompleted
            ? { [Op.gte]: completedId } // Completed
            : { [Op.and]: [{ [Op.gte]: offeredId }, { [Op.lt]: completedId }] }; // Active

        let { rows, count } = await IgbAccount.findAndCountAll({
            distinct: true,
            include: [
                {
                    model: AdCampaignIgbAccountUser,
                    as: 'matches',
                    attributes: [],
                    where: {
                        ad_campaign_state_id: stateCondition
                    },
                    include: [{
                        model: AdCampaign,
                        as: 'ad_campaign',
                        where: {
                            publish_until: {
                                [Op.or]: [
                                    { [Op.lte]: new Date() },
                                    null // means always open
                                ]
                            },
                            user_id: req.user.id,
                        }
                    }]
                }
            ]
        });

        return {
            agreements: rows,
            total: count
        };
    }

}
export default new AgreementService;