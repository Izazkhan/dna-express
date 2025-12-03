import express from 'express';
import UserAuthController from '../../app/controllers/web/users-controller.js';

const router = express.Router();

router.get('/:id', UserAuthController.getUserById);
router.put('/:id', UserAuthController.updateMe);

export default router;