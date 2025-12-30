import asyncHandler from "../../utils/async-handler.js";
import MatcherQueue from "../../queues/matcher/matcher-queue.js";

class TestingController {
    index = asyncHandler(async (req, res) => {
        // Trigger the event by adding a job to the queue
        console.log("Dispatching matcher job for campaign 1");
        await MatcherQueue.addJob(1);

        res.status(200).json({
            message: "Matcher job dispatched for campaign 1"
        });
    })
}

export default new TestingController;