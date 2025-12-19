import express from 'express';
import InfluencersController from '../../app/controllers/app-api/adcampaign/influencers-controller.js';

const routes = express.Router();
const otherRoutes = express.Router();
const router = express.Router();

routes.patch('/:ad_campaign_id/igb-account/:igb_account_id/accept', InfluencersController.acceptCampaign);
routes.patch('/:ad_campaign_id/igb-account/:igb_account_id/reject', InfluencersController.rejectCampaign);
routes.get('/:igb_account_id/feed', InfluencersController.feed);
router.use('/adcampaign/', routes)

router.use('/', otherRoutes)


export default router;
