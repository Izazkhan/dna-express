import { Worker } from 'bullmq';
import redisConnection from '../connection.js';
import MatcherService from '../../app/services/matcher-service.js';

class MatcherWorker {
    constructor() {
        this.worker = null;
    }

    /**
     * Initializes and starts the worker process
     */
    setup() {
        // 'matcher-queue' must match the name used in your Controller
        this.worker = new Worker('matcher-queue', async (job) => {
            console.log("!!! WORKER RECEIVED JOB !!!", job.id)
            const { campaignId } = job.data;

            console.log(`[Job ${job.id}] Processing matching for Campaign: ${campaignId}`);

            try {
                // Call your class-based service
                const result = await MatcherService.processCampaignById(campaignId);

                return {
                    success: true,
                    count: result,
                    message: `Matched ${result} accounts`
                };
            } catch (error) {
                console.error(`[Job ${job.id}] Service Error:`, error.message);
                // Throwing error here tells BullMQ to attempt a retry
                throw error;
            }
        }, {
            connection: redisConnection,
            concurrency: 5, // Process 5 campaigns simultaneously per worker instance
            removeOnComplete: { count: 20 }, // Keep last 20 logs
            removeOnFail: { count: 500 }
        });

        this.listenForEvents();
        console.log('🚀 Matcher Worker is online and waiting for jobs...');
    }

    listenForEvents() {
        // THIS IS CRITICAL: If this doesn't trigger, the worker isn't connected
        this.worker.on('ready', () => {
            console.log('✅ Worker is officially connected to Redis');
        });

        this.worker.on('completed', (job, returnvalue) => {
            console.log(`✅ Job ${job.id} completed: ${returnvalue.message}`);
        });

        this.worker.on('failed', (job, err) => {
            console.error(`❌ Job ${job.id} failed: ${err.message}`);
        });

        this.worker.on('error', (err) => {
            console.error('🔥 Critical Worker Error:', err);
        });
    }

    /**
     * Graceful shutdown for Docker/Kubernetes
     */
    async shutdown() {
        await this.worker.close();
        console.log('Worker shut down safely.');
    }
}

export default new MatcherWorker();