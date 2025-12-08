import Joi from "joi";

export const validateCreateIgbAccountUser = Joi.object({
    fb_page_id: Joi.string().min(2).max(50).optional().allow(null),
    email: Joi.string().email().allow(null).optional(),
    website: Joi.string().allow(null).optional(),
    profile_picture_url: Joi.string().allow(null).optional(),
    username: Joi.string().allow(null).optional(),
    name: Joi.string().allow(null).optional(),
    instagram_account_id: Joi.string().required(),
    is_profile: Joi.boolean().required(),
    is_tag_generator: Joi.boolean().required(),
    is_active: Joi.boolean().required(),
    is_featured: Joi.boolean().allow(null),
    featured_date: Joi.date().allow(null),
});