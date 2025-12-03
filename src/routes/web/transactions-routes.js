import express from 'express';
import { protect } from '../../app/middlewares/auth-middleware.js';
import TransactionsController from '../../app/controllers/web/transaction-controller.js';

const router = express.Router();

router.use(protect); // add middleware to protect routes

router.get('/', TransactionsController.get);
router.post('/', TransactionsController.create);

export default router;