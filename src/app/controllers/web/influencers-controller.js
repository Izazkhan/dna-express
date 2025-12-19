import { Op } from "sequelize";
import { ApiResponse } from "../../../utils/api-response.js";
import asyncHandler from "../../../utils/async-handler.js";
import AdCampaign from "../../models/AdCampaign.js";
import AdCampaignIgbAccountUser from "../../models/AdCampaignIgbAccountUser.js";
import AdCampaignState from "../../models/AdCampaignState.js";
import IgbAccount from "../../models/IgbAccount.js";
import IgProfileAverageInsights from "../../models/IgProfileAverageInsights.js";
import { LocationService } from "../../services/web/location-service.js";

export class InfluencersController {
    list = asyncHandler(async (req, res) => {
        let influencers = await IgbAccount.findAll({
            include: [
                {
                    model: AdCampaignIgbAccountUser,
                    as: 'matches',
                    attributes: [],
                    where: {
                        ad_campaign_state_id: await AdCampaignState.offeredId()
                    },
                    include: [{
                        model: AdCampaign,
                        as: 'ad_campaign',
                        where: {
                            user_id: req.user.id
                        }
                    }]
                }, {
                    model: IgProfileAverageInsights,
                    as: 'profile_average_insights',
                }
            ]
        })

        res.status(200).json(new ApiResponse('Influencers list', influencers));
    })

    accepted = asyncHandler(async (req, res) => {
        let influencers = await IgbAccount.findAll({
            include: [
                {
                    model: AdCampaignIgbAccountUser,
                    as: 'matches',
                    attributes: [],
                    where: {
                        // accepted
                        ad_campaign_state_id: await AdCampaignState.offeredId()
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
                            user_id: req.user.id
                        }
                    }]
                }, {
                    model: IgProfileAverageInsights,
                    as: 'profile_average_insights',
                }
            ]
        })

        res.status(200).json(new ApiResponse('Influencers list', influencers));
    })

    active = asyncHandler(async (req, res) => {
        let influencers = await IgbAccount.findAll({
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
                }, {
                    model: IgProfileAverageInsights,
                    as: 'profile_average_insights',
                }
            ]
        })

        res.status(200).json(new ApiResponse('Influencers list', influencers));
    })

    rehected = asyncHandler(async (req, res) => {
        let influencers = await IgbAccount.findAll({
            include: [
                {
                    model: AdCampaignIgbAccountUser,
                    as: 'matches',
                    attributes: [],
                    where: {
                        // rejected
                        rejected: true,
                        ad_campaign_state_id: { [Op.lte]: await AdCampaignState.acceptedId() }
                    },
                    include: [{
                        model: AdCampaign,
                        as: 'ad_campaign',
                        where: {
                            publish_until: {
                                [Op.or]: [
                                    { [Op.gte]: new Date() },
                                    null
                                ]
                            },
                            user_id: req.user.id,
                        }
                    }]
                }, {
                    model: IgProfileAverageInsights,
                    as: 'profile_average_insights',
                }
            ]
        })

        res.status(200).json(new ApiResponse('Influencers list', influencers));
    })

    archived = asyncHandler(async (req, res) => {
        let influencers = await IgbAccount.findAll({
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
                }, {
                    model: IgProfileAverageInsights,
                    as: 'profile_average_insights',
                }
            ]
        })

        res.status(200).json(new ApiResponse('Influencers list', influencers));
    })
}

// Instantiate and export default for easy import
export default new InfluencersController();