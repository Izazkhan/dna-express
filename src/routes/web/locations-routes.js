import express from 'express';
import locationController from '../../app/controllers/web/location-controller.js';
import { protect } from '../../app/middlewares/auth-middleware.js';

const router = express.Router();

router.use(protect); // add middleware to protect routes
router.get('/search', locationController.search);

export default router;