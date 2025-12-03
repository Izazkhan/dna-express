import express from 'express';
import paymentController from '../../app/controllers/web/payment-controller.js';
import { protect } from '../../app/middlewares/auth-middleware.js';
const router = express.Router();

router.use(protect); // add middleware to protect routes

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/stripe/verify-payment/:id', paymentController.verifyPayment);

export default router;