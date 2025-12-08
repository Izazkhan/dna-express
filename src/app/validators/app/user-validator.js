import Joi from "joi";

export const validateCreateUser = Joi.object({
    name: Joi.string().min(2).max(50).optional().allow(null),
    email: Joi.string().email().allow(null).optional(),
    username: Joi.string().allow(null).optional(),
    fb_user_id: Joi.string().required(),
    access_token: Joi.string().required(),
});