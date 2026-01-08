import express from 'express';
import InfluencersController from '../../app/controllers/web/influencers-controller.js';
import autoId from '../../app/middlewares/auto-id-validator-middleware.js';
const router = express.Router();

router.get('/influencers', InfluencersController.list);
router.get('/influencers/accepted', InfluencersController.accepted);
router.get('/influencers/active', InfluencersController.active);
router.get('/influencers/rejected', InfluencersController.rejected);
router.get('/influencers/archived', InfluencersController.archived);
router.get('/influencer/:igb_account_id/posts', autoId.validate, InfluencersController.posts);

export default router;
