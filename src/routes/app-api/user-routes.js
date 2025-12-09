import express from 'express';
import UsersController from '../../app/controllers/app-api/users-controller.js';
import { validate } from '../../app/middlewares/validation-middleware.js';
import { validateCreateUser } from '../../app/validators/app/user-validator.js';
import { validateCreateIgbAccountUser } from '../../app/validators/app/igb-account-validator.js';
import IgbAccountsController from '../../app/controllers/app-api/igb-accounts-controller.js';

const publicRouter = express.Router();
const privateRouter = express.Router();

// PUBLIC ROUTES
publicRouter.post('/', validate(validateCreateUser), UsersController.create);

// PRIVATE ROUTES
publicRouter.post('/:fb_user_id/igb-account',
    validate(validateCreateIgbAccountUser),
    IgbAccountsController.create
);

privateRouter.get('/:fb_user_id', UsersController.getById);

export { publicRouter, privateRouter };
