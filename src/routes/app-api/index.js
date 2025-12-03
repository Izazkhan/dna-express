// const express = require('express');
import express from 'express';
import userRoutes from './user-routes.js';
import { appProtect } from '../../app/middlewares/app-auth-middleware.js';

const router = express.Router();

// unprotected routes start
router.use('/users', userRoutes);
// unprotected routes ends

router.use(appProtect);
// below all routes are protected
// router.use('/feed', feedRoutes);

export default router;