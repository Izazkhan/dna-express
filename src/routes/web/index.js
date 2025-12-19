// const express = require('express');
import express from 'express';
import authRoutes from './auth-routes.js';
import userRoutes from './user-routes.js';
import adCampaignRoutes from './ad-campaign-routes.js';
import locationsRoutes from './locations-routes.js';
import influencerRoutes from './influencers-routes.js';
import paymentRoutes from './payment-routes.js';
import transactionsRoutes from './transactions-routes.js';
import AuthMiddleware from '../../app/middlewares/auth-middleware.js';
import TestingController from '../../app/controllers/testing-controller.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.get('/testing', TestingController.index);

router.use(AuthMiddleware.handle); // below this line the routes are protected
router.use('/users', userRoutes);
router.use('/adcampaigns', adCampaignRoutes);
router.use('/locations', locationsRoutes);
router.use('/payments', paymentRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/', influencerRoutes);

export default router;