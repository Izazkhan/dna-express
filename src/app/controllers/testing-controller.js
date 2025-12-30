import { Op } from "sequelize";
import { sequelize } from "../../config/database.js";
import asyncHandler from "../../utils/async-handler.js";
import AdCampaign from "../models/AdCampaign.js";
import AdCampaignDemographic from "../models/AdCampaignDemographic.js";
import AdCampaignEngagementRange from "../models/AdCampaignEngagementRange.js";
import MatcherService from "../services/matcher-service.js";

class TestingController {
    index = asyncHandler(async (req, res) => {
        try {
            let result = await MatcherService.run();
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