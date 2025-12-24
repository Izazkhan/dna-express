import express from 'express';
import InfluencersController from '../../app/controllers/web/influencers-controller.js';
import { validateCreateCampaign, validateUpdateCampaign } from '../../app/validators/web/campaign-validator.js';
import { validate } from '../../app/middlewares/validation-middleware.js';
const router = express.Router();

router.get('/influencers', InfluencersController.list);
router.get('/influencers/accepted', InfluencersController.accepted);
router.get('/influencers/active', InfluencersController.active);
router.get('/influencers/rejected', InfluencersController.rejected);
router.get('/influencers/archived', InfluencersController.archived);

export default router;
