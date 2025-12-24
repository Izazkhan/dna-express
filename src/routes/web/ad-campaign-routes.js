import express from 'express';
import AdCampaignsController from '../../app/controllers/web/ad-campaigns-controller.js';
import { validateCreateCampaign, validateUpdateCampaign } from '../../app/validators/web/campaign-validator.js';
import { validate } from '../../app/middlewares/validation-middleware.js';
import ProposalsController from '../../app/controllers/web/proposals-controller.js';
const router = express.Router();

router.post('/', validate(validateCreateCampaign), AdCampaignsController.create);
router.get('/', AdCampaignsController.getAll);
router.get('/options', AdCampaignsController.options);
router.get('/edit/:id', AdCampaignsController.getForEditPage);
// proposal related campaigns
router.get('/with-active-proposals', AdCampaignsController.withActiveProposals);
router.get('/with-accepted-proposals', AdCampaignsController.withAcceptedProposals);
router.get('/with-rejected-proposals', AdCampaignsController.withRejectedProposals);
router.get('/with-completed-proposals', AdCampaignsController.withCompletedProposals);

router.get('/:id', AdCampaignsController.get);
router.put('/:id', validate(validateUpdateCampaign), AdCampaignsController.update);

// Proposals related to a campaign
router.get('/:id/proposals/active', ProposalsController.active);
router.get('/:id/proposals/accepted', ProposalsController.accepted);
router.get('/:id/proposals/rejected', ProposalsController.rejected);
router.get('/:id/proposals/completed', ProposalsController.completed);

export default router;
