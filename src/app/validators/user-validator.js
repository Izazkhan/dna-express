import Joi from 'joi';

export const validateUpdateUser = Joi.object({
    name: Joi.string().min(2).max(100),
}).min(1);