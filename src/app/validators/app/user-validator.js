export const validateCreateUser = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    fb_user_id: Joi.string().required(),
    access_token: Joi.string().required(),
    role: Joi.string()
        .valid('influencer')
        .required()
});