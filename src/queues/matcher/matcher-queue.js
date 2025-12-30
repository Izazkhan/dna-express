import { Queue } from 'bullmq';
import redisConnection from '../connection.js'; 

class MatcherQueue {
    constructor() {
        /**
         * Initialize the BullMQ Queue. 
         */
        console.log('🚀 Initializing Matcher Queue...');
        this.queue = new Queue('matcher-queue', {
            connection: redisConnection,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
                // Clean up Redis memory once the job is finished
                removeOnComplete: {
                    age: 3600, // Keep logs for 1 hour
                    count: 100, // Or keep the last 100 jobs
                },
                removeOnFail: {
                    age: 48 * 3600, // Keep failed jobs for 48h for debugging
                },
            },
        });
    }

    /**
     * Dispatch a matching job.
     * * @param {number|string} campaignId 
     */
    async addJob(campaignId) {
        try {
            console.log(`[Queue] Adding job for campaign ${campaignId}`);
            // 'run-matcher' is the specific action name
            const job = await this.queue.add(
                'run-matcher',
                { campaignId },
                { jobId: `campaign-${campaignId}` } // Prevents duplicate jobs for the same campaign if clicked twice
            );

            console.log(`[Queue] Job ${job.id} added for campaign ${campaignId}`);
            return job;
        } catch (error) {
            console.error(`[Queue] Error adding job for campaign ${campaignId}:`, error);
            throw error;
        }
    }

    /**
     * Optional: Bulk add jobs (Useful for re-syncing thousands of campaigns)
     */
    async addBulkJobs(campaignIds) {
        const jobs = campaignIds.map(id => ({
            name: 'run-matcher',
            data: { campaignId: id },
            opts: { jobId: `campaign-${id}` }
        }));

        return await this.queue.addBulk(jobs);
    }
}

export default new MatcherQueue();