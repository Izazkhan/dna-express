import express from 'express';
import AgreementsController from '../../app/controllers/web/agreements-controller.js';
const router = express.Router();

router.get('/agreements', AgreementsController.index);

export default router;
