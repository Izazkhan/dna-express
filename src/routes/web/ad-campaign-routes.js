import express from 'express';
import AdCampaignsController from '../../app/controllers/web/ad-campaigns-controller.js';
import { validateCreateCampaign, validateUpdateCampaign } from '../../app/validators/web/campaign-validator.js';
import { validate } from '../../app/middlewares/validation-middleware.js';
import ProposalsController from '../../app/controllers/web/proposals-controller.js';
import autoId from '../../app/middlewares/auto-id-validator-middleware.js';
const router = express.Router();

router.post('/', validate(validateCreateCampaign), AdCampaignsController.create);
router.get('/', AdCampaignsController.getAll);
router.get('/options', AdCampaignsController.options);
router.get('/edit/:id', autoId.validate, AdCampaignsController.getForEditPage);
// proposal related campaigns
router.get('/with-active-proposals', AdCampaignsController.withActiveProposals);
router.get('/with-accepted-proposals', AdCampaignsController.withAcceptedProposals);
router.get('/with-rejected-proposals', AdCampaignsController.withRejectedProposals);
router.get('/with-completed-proposals', AdCampaignsController.withCompletedProposals);

router.get('/:id', autoId.validate, AdCampaignsController.get);
router.put('/:id', autoId.validate, validate(validateUpdateCampaign), AdCampaignsController.update);

// Proposals related to a campaign
router.get('/:id/proposals/active', autoId.validate, ProposalsController.active);
router.get('/:id/proposals/accepted', autoId.validate, ProposalsController.accepted);
router.get('/:id/proposals/rejected', autoId.validate, ProposalsController.rejected);
router.get('/:id/proposals/completed', autoId.validate, ProposalsController.completed);

export default router;
