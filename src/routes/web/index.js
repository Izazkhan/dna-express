// const express = require('express');
import express from 'express';
import authRoutes from './auth-routes.js';
import userRoutes from './user-routes.js';
import adCampaignRoutes from './ad-campaign-routes.js';
import locationsRoutes from './locations-routes.js';
import paymentRoutes from './payment-routes.js';
import transactionsRoutes from './transactions-routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/adcampaigns', adCampaignRoutes);
router.use('/locations', locationsRoutes);
router.use('/payments', paymentRoutes);
router.use('/transactions', transactionsRoutes);

export default router;