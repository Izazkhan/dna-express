import { Op } from "sequelize";
import { ApiError } from "../../../../utils/api-response.js";
import models from "../../../models/index.js";
import { sequelize } from "../../../../config/database.js";
const { IgbAccount, AdCampaignState, AdCampaignIgbAccountUser, AdCampaign } = models;

class InfluencerService {
    async acceptCampaign(req) {
        let account = await IgbAccount.findOne({
            where: {
                instagram_account_id: req.params.igb_account_id,
                user_id: req.user.id
            }
        });

        if (!account) {
            throw new ApiError(404, 'Igb account not found');
        }

        let match = await AdCampaignIgbAccountUser.findOne({
            where: {
                igb_account_id: account.id,
                ad_campaign_id: req.params.ad_campaign_id
            },
            include: ['ad_campaign']
        })


        if (!match) {
            throw new ApiError(404, 'No match found');
        }

        if (match.ad_campaign.is_approval_required) {
            match.ad_campaign_state_id = await AdCampaignState.acceptedId();
        } else {
            match.ad_campaign_state_id = await AdCampaignState.offeredId();
        }

        match.rejected = false;
        match.viewed = false; // from advertiser's perspective

        // update the match/state
        await match.save();

        return {
            match
        };
    }
    
    async rejectCampaign(req) {
        let account = await IgbAccount.findOne({
            where: {
                instagram_account_id: req.params.igb_account_id,
                user_id: req.user.id
            }
        });

        if (!account) {
            throw new ApiError(404, 'Igb account not found');
        }

        let match = await AdCampaignIgbAccountUser.findOne({
            where: {
                igb_account_id: account.id,
                ad_campaign_id: req.params.ad_campaign_id
            },
            include: ['ad_campaign']
        })


        if (!match) {
            throw new ApiError(404, 'No match found');
        }

        match.rejected = true;
        // if influencer initially reject, and later want to accept.
        match.ad_campaign_state_id = await AdCampaignState.matchedId();
        await match.save();

        return {
            match
        };
    }

    async feed(req) {
        let account = await IgbAccount.findOne({
            where: {
                instagram_account_id: req.params.igb_account_id,
                user_id: req.user.id
            }
        });

        if (!account) {
            throw new ApiError(404, 'Igb account not found');
        }
        let completedId = await AdCampaignState.completedId();
        let campaigns = await AdCampaign.scope('isMatching').findAll({
            include: [
                {
                    model: AdCampaignIgbAccountUser,
                    as: 'match',
                    where: {
                        igb_account_id: account.id,
                        ad_campaign_state_id: {
                            [Op.lte]: completedId
                        }
                    },
                    include: ['ad_campaign_state']
                }
            ]
        })

        // Update the status to viewed (in feed)
        campaigns.map(async (c, i) => {
            if (!c.match.viewed) {
                await AdCampaignIgbAccountUser.update({
                    viewed: true
                    // from influencer's perspective
                }, {
                    where: {
                        ad_campaign_id: c.id,
                        igb_account_id: account.id
                    }
                })
            }
        })

        return campaigns;
    }
}

export default new InfluencerService;