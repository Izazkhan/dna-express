import { ApiResponse } from "../../../utils/api-response.js";
import asyncHandler from "../../../utils/async-handler.js";
import AdCampaignDeliverable from "../../models/AdCampaignDeliverable.js";
import AdCampaignAgeRange from "../../models/AdCampaignAgeRange.js";
import AdCampaignEngagementRange from "../../models/AdCampaignEngagementRange.js";
import AdCampaignService from "../../services/web/ad-campaign-service.js";
import { Op } from "sequelize";
import { sequelize } from "../../../config/database.js";
import AdCampaignDemographicService from "../../services/web/ad-campaign-demographic-service.js";

/**
 * Controller handling ad campaign lifecycle, configuration options, and filtered proposal views.
 */
class AdCampaignsController {
    constructor() {
        this.service = AdCampaignService;
        this.demographicService = AdCampaignDemographicService;
    }

    /**
     * @method create
     * @description Creates a new ad campaign.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    create = asyncHandler(async (req, res) => {
        const campaign = await this.service.create(req);
        return res.status(200).json(new ApiResponse('message', campaign));
    });

    /**
     * @method update
     * @description Updates an existing ad campaign.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    update = asyncHandler(async (req, res) => {
        const campaign = await this.service.update(req);
        return res.status(200).json(new ApiResponse('message', campaign));
    });

    /**
     * @method getAll
     * @description Retrieves all campaigns for the user with simple pagination.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    getAll = asyncHandler(async (req, res) => {
        try {
            const campaigns = await this.service.getAllWithSimplePagination(req);
            return res.status(200).json(new ApiResponse('message', campaigns));
        } catch (error) {
            console.error('Error fetching campaigns with pagination:', error);
            return res.status(500).json(new ApiResponse('An error occurred while fetching campaigns.', null, false));
        }
    })

    /**
     * @method get
     * @description Retrieves a single campaign by ID including detailed insights.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    get = asyncHandler(async (req, res) => {
        const response = await this.service.getWithDetail(req, req.params.id);
        if (!response) {
            return res.status(404).json({ message: "Campaign not found" });
        }
        return res.status(200).json(new ApiResponse('Campaign with insights', response));
    })
    
    /**
     * @method getForEditPage
     * @description Retrieves campaign data structured specifically for the edit interface.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    getForEditPage = asyncHandler(async (req, res) => {
        const campaign = await this.service.getForEditPage(req, req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }
        return res.status(200).json(new ApiResponse('message', campaign));
    })

    /**
     * @method getEngagementRanges
     * @description Fetches all available engagement ranges ordered by sequence.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<void>}
     */
    getEngagementRanges = asyncHandler(async (req, res) => {
        const ranges = await AdCampaignEngagementRange.findAll({ order: [['order', 'ASC']] });
        res.json({ data: ranges });
    })

    /**
     * @method getDeliverables
     * @description Fetches all available campaign deliverable types.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<void>}
     */
    getDeliverables = asyncHandler(async (req, res) => {
        const result = await AdCampaignDeliverable.findAll();
        res.json({ data: result });
    })

    /**
     * @method getAgeRanges
     * @description Fetches all available age range demographics.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<void>}
     */
    getAgeRanges = asyncHandler(async (req, res) => {
        const result = await AdCampaignAgeRange.findAll();
        res.json({ data: result });
    })

    /**
     * @method options
     * @description Aggregates all configuration options (deliverables, age ranges, engagement) for campaign creation.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<void>}
     */
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

    /**
     * @method withActiveProposals
     * @description Retrieves campaigns that have active proposals.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    withActiveProposals = asyncHandler(async (req, res) => {
        try {
            const result = await this.service.fetchCampaignsWithProposalScope(req, 'hasActiveProposals');
            return res.status(200).json(new ApiResponse('message', result));
        } catch (error) {
            console.error('Error fetching campaigns with pagination:', error);
            return res.status(500).json(new ApiResponse('An error occurred while fetching campaigns.', null, false));
        }
    })
    
    /**
     * @method withAcceptedProposals
     * @description Retrieves campaigns that have accepted proposals.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    withAcceptedProposals = asyncHandler(async (req, res) => {
        try {
            const result = await this.service.fetchCampaignsWithProposalScope(req, 'hasAcceptedProposals');
            return res.status(200).json(new ApiResponse('Campaign with accepted proposals', result));
        } catch (error) {
            console.error('Error fetching campaigns with pagination:', error);
            return res.status(500).json(new ApiResponse('An error occurred while fetching campaigns.', null, false));
        }
    })
    
    /**
     * @method withRejectedProposals
     * @description Retrieves campaigns that have rejected proposals.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    withRejectedProposals = asyncHandler(async (req, res) => {
        try {
            const result = await this.service.fetchCampaignsWithProposalScope(req, 'hasRejectedProposals');
            return res.status(200).json(new ApiResponse('Campaign with rejected proposals', result));
        } catch (error) {
            console.error('Error fetching campaigns with pagination:', error);
            return res.status(500).json(new ApiResponse('An error occurred while fetching campaigns.', null, false));
        }
    })
    
    /**
     * @method withCompletedProposals
     * @description Retrieves campaigns that have completed proposals.
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @returns {Promise<import('express').Response>}
     */
    withCompletedProposals = asyncHandler(async (req, res) => {
        try {
            const result = await this.service.fetchCampaignsWithProposalScope(req, 'hasCompletedProposals');
            return res.status(200).json(new ApiResponse('Campaign with completed proposals', result));
        } catch (error) {
            console.error('Error fetching campaigns with pagination:', error);
            return res.status(500).json(new ApiResponse('An error occurred while fetching campaigns.', null, false));
        }
    })
}

export default new AdCampaignsController();