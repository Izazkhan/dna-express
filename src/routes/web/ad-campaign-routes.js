import express from 'express';
import AdCampaignsController from '../../app/controllers/web/ad-campaigns-controller.js';
import { validateCreateCampaign, validateUpdateCampaign } from '../../app/validators/web/campaign-validator.js';
import { validate } from '../../app/middlewares/validation-middleware.js';
const router = express.Router();

router.post('/', validate(validateCreateCampaign), AdCampaignsController.create);
router.put('/:id', validate(validateUpdateCampaign), AdCampaignsController.update);
router.get('/', AdCampaignsController.getAll);
router.get('/options', AdCampaignsController.options);
router.get('/edit/:id', AdCampaignsController.getForEditPage);
router.get('/:id', AdCampaignsController.get);

export default router;
