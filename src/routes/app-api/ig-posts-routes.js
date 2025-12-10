import express from 'express';
import PostsController from '../../app/controllers/app-api/posts-controller.js';

const privateRouter = express.Router();

privateRouter.get('/:igb_account_id/posts', PostsController.getTopPosts);

export default privateRouter;
