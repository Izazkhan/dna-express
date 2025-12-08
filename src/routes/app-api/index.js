// const express = require('express');
import express from 'express';
import userRoutes from './user-routes.js';
import AppAuthMiddleware from '../../app/middlewares/app-auth-middleware.js';

const router = express.Router();

// unprotected routes
router.use('/users', userRoutes);

router.use(AppAuthMiddleware.handle);
// below all routes are protected
// router.use('/feed', feedRoutes);

export default router;