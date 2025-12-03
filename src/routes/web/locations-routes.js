import express from 'express';
import locationController from '../../app/controllers/web/locations-controller.js';

const router = express.Router();

router.get('/search', locationController.search);

export default router;