import app from './src/app.js';
import { connectDB } from './src/config/database.js';
import logger from './src/utils/logger.js';

const startServer = async () => {
    try {
        await connectDB();

        app.listen(process.env.APP_PORT, () => {
            logger.info(`Server running on port ${process.env.APP_PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    process.exit(1);
});