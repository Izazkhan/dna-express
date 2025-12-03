import express from 'express';
import { protect } from '../../app/middlewares/auth-middleware.js';
import AdCampaignsController from '../../app/controllers/web/ad-campaign-controller.js';
import { validateCreateCampaign, validateUpdateCampaign } from '../../app/validators/campaign-validator.js';
import { validate } from '../../app/middlewares/validation-middleware.js';
const router = express.Router();

router.use(protect);

router.post('/', validate(validateCreateCampaign), AdCampaignsController.create);
router.put('/:id', validate(validateUpdateCampaign), AdCampaignsController.update);
router.get('/', AdCampaignsController.getAll);
router.get('/options', AdCampaignsController.options);
router.get('/edit/:id', AdCampaignsController.getForEditPage);
router.get('/:id', AdCampaignsController.get);

export default router;
