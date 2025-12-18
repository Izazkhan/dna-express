import { Op } from "sequelize";
import { ApiResponse } from "../../utils/api-response.js";
import asyncHandler from "../../utils/async-handler.js";
import models from "../models/index.js";
import MatcherService from "../services/matcher-service.js";
import { sequelize } from "../../config/database.js";

const { AdCampaign, AdCampaignDemographic, AdCampaignEngagementRange } = models;
class TestingController {
    index = asyncHandler(async (req, res) => {
        try {
            const result = await MatcherService.run();
            res.json({
                success: true,
                message: 'Matcher executed successfully',
                data: { result }
            });
        } catch (error) {
            console.error('Error running matcher:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    })
}

export default new TestingController;