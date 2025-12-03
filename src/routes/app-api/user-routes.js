import express from 'express';
import UsersController from '../../app/controllers/app-api/users-controller.js';

const router = express.Router();
// All routes below are protected
router.post('/', UsersController.create);

export default router;