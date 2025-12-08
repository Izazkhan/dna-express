// src/app.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import webRoutes from './routes/web/index.js';
import appRoutes from './routes/app-api/index.js';
import { errorHandler, notFound } from './app/middlewares/error-middleware.js';
import logger from './utils/logger.js';
import PaymentController from './app/controllers/web/payments-controller.js';
import cookieParser from 'cookie-parser';

const app = express();

// This api must use the raw body parser for Stripe webhooks
app.post('/api/payments/stripe/webhook', express.raw({ type: 'application/json' }), PaymentController.handleStripeWebhook);

// Body parsing middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));


// Logging middleware
app.use(
    morgan('combined', {
        stream: { write: (msg) => logger.info(msg.trim()) }
    })
);

// Health check
app.get('/health', (req, res) => {
    return res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// API routes
app.use('/api/app', appRoutes);
app.use('/api/', webRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;