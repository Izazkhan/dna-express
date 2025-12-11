import express from 'express';
import InfluencersController from '../../app/controllers/app-api/adcampaign/influencers-controller.js';

const router = express.Router();

router.patch('/:ad_campaign_id/igb_accounts/:igb_account_id/accept', InfluencersController.acceptCampaign);

export default router;
