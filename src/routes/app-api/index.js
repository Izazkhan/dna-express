import express from 'express';
import { publicRouter as userPublicRoutes, privateRouter as userPrivateRoutes } from './user-routes.js';
import IgPostsRoutes from './ig-posts-routes.js';
import InfluencersRoutes from './influencers-routes.js';
import AppAuthMiddleware from '../../app/middlewares/app-auth-middleware.js';

const router = express.Router();

// UNPROTECTED USER ROUTES
router.use('/users', userPublicRoutes);

// ENABLE AUTH
router.use(AppAuthMiddleware.handle);

// PROTECTED USER ROUTES
router.use('/users', userPrivateRoutes);
router.use('/igb-accounts', IgPostsRoutes);
router.use('/adcampaigns/', InfluencersRoutes);

// other protected routing groups go here…

export default router;
