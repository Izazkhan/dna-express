import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';

// config/database.js
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        ssl: false,
        dialectOptions: {
            clientMinMessages: 'notice'
        }
    });

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.info('PostgreSQL connected successfully');
    } catch (error) {
        logger.error('Unable to connect to PostgreSQL:', error);
        throw error;
    }
};

// export const syncModels = async () => {
//     try {
//         // Use alter in development, avoid in production
//         if (process.env.NODE_ENV === 'development') {
//             await sequelize.sync({ force: true });
//             logger.info('Database models synchronizedd (alter: true)');
//         }
//     } catch (error) {
//         logger.error('Error synchronizing models:', error);
//         throw error;
//     }
// };