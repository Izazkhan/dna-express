import express from 'express';
import AgreementsController from '../../app/controllers/web/agreements-controller.js';
const router = express.Router();

router.get('/agreements/active', AgreementsController.index);
router.get('/agreements/completed', AgreementsController.completed);

export default router;
