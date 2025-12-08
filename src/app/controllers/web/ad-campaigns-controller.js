import { ApiResponse } from "../../../utils/api-response.js";
import asyncHandler from "../../../utils/async-handler.js";
import AdCampaignDeliverable from "../../models/AdCampaignDeliverable.js";
import AdCampaignAgeRange from "../../models/AdCampaignAgeRange.js";
import AdCampaignEngagementRange from "../../models/AdCampaignEngagementRange.js";
import AdCampaignService from "../../services/web/ad-campaign-service.js";
import { Op } from "sequelize";
import { sequelize } from "../../../config/database.js";
import AdCampaignDemographicService from "../../services/web/ad-campaign-demographic-service.js";

class AdCampaignsController {
    constructor() {
        this.service = AdCampaignService;
        this.demographicService = AdCampaignDemographicService;
    }

    create = asyncHandler(async (req, res) => {
        const campaign = await this.service.create(req);
        return res.status(200).json(new ApiResponse('message', campaign));
    });

    update = asyncHandler(async (req, res) => {
        const campaign = await this.service.update(req);
        return res.status(200).json(new ApiResponse('message', campaign));
    });

    getAll = asyncHandler(async (req, res) => {
        try {
            const campaigns = await this.service.getAllWithSimplePagination(req);
            return res.status(200).json(new ApiResponse('message', campaigns));
        } catch (error) {
            console.error('Error fetching campaigns with pagination:', error);
            return res.status(500).json(new ApiResponse('An error occurred while fetching campaigns.', null, false));
        }
    })

    get = asyncHandler(async (req, res) => {
        const campaign = await this.service.getWithDetail(req, req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }
        return res.status(200).json(new ApiResponse('message', campaign));
    })
    
    getForEditPage = asyncHandler(async (req, res) => {
        const campaign = await this.service.getForEditPage(req, req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }
        return res.status(200).json(new ApiResponse('message', campaign));
    })

    getEngagementRanges = asyncHandler(async (req, res) => {
        const ranges = await AdCampaignEngagementRange.findAll({ order: [['order', 'ASC']] });
        res.json({ data: ranges });
    })

    getDeliverables = asyncHandler(async (req, res) => {
        const result = await AdCampaignDeliverable.findAll();
        res.json({ data: result });
    })

    getAgeRanges = asyncHandler(async (req, res) => {
        const result = await AdCampaignAgeRange.findAll();
        res.json({ data: result });
    })

    options = asyncHandler(async (req, res) => {
        const result = {
            deliverables: await AdCampaignDeliverable.findAll(),
            age_ranges: await AdCampaignAgeRange.findAll({
                where: {
                    name: { [Op.ne]: '13-17' }
                }
            }),
            engagement_ranges: await AdCampaignEngagementRange.findAll({ order: [['order', 'ASC']] })
        }
        res.json({ data: result });
    })
}

export default new AdCampaignsController();