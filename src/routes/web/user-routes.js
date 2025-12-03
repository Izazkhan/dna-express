import express from 'express';
import { protect } from '../../app/middlewares/auth-middleware.js';
import UserAuthController from '../../app/controllers/web/user-controller.js';

const router = express.Router();

router.use(protect); // add middleware to protect routes
// All routes below are protected
router.get('/:id', UserAuthController.getUserById);
router.put('/:id', UserAuthController.updateMe);

export default router;