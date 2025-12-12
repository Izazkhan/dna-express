import cron from "node-cron";
import runMatcher from "../services/runMatcher.js"; // your custom logic
import models from "../app/models/index.js";
import MatcherService from "../app/services/matcher-service.js";

const { AdCampaign } = models;
// Runs every minute
cron.schedule('* * * * *', async () => {
    console.log("Running Campaign Matcher Cron...");

    try {
        // Run matcher
        await MatcherService.run();

    } catch (err) {
        console.error("Cron Error:", err);
    }
});
