import express from 'express';
import TransactionsController from '../../app/controllers/web/transactions-controller.js';

const router = express.Router();

router.get('/', TransactionsController.get);
router.post('/', TransactionsController.create);

export default router;