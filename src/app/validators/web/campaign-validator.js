import Joi from 'joi';

export const validateCreateCampaign = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': 'Campaign name is required',
        }),

    description: Joi.string().trim().max(5000)
        .messages({
            'string.max': 'Description cannot exceed 5000 characters',
        }),

    platform: Joi.string()
        .valid('instagram', 'tiktok')
        .required()
        .messages({
            'any.only': 'Platform must be instagram or tiktok',
            'any.required': 'Platform is required',
        }),

    follower_min: Joi.number().integer().min(0).allow(null)
        .messages({
            'number.min': 'Minimum followers cannot be negative',
        }),

    follower_max: Joi.number().integer().min(0).allow(null)
        .custom((value, helpers) => {
            const min = helpers.state.ancestors[0].follower_min;
            if (min !== undefined && value < min) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .messages({
            'any.invalid': 'follower_max must be ≥ follower_min',
        }),

    likes_min: Joi.number().integer().min(0).allow(null),
    likes_max: Joi.number().integer().min(0).allow(null)
        .custom((value, helpers) => {
            const min = helpers.state.ancestors[0].likes_min;
            if (min !== undefined && value < min) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .messages({
            'any.invalid': 'likes_max must be ≥ likes_min',
        }),

    ad_campaign_engagement_range_id: Joi.number().positive().required()
        .messages({
            'number.base': 'Engagement range ID must be a number',
            'any.required': 'Engagement range is required',
        }),

    draft_date: Joi.date().iso().allow(null),
    publish_from: Joi.date().iso().required()
        .messages({
            'date.format': 'publish_from must be in ISO format (YYYY-MM-DDTHH:mm:ssZ)',
            'any.required': 'Start date is required',
        }),

    publish_until: Joi.date().optional().allow("").allow(null).iso().min(Joi.ref('publish_from'))
        .messages({
            'date.min': 'publish_until must be after publish_from',
            'date.format': 'publish_until must be in ISO format',
        }),

    ad_campaign_deliverable_id: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'Deliverable ID must be a number',
            'any.required': 'Deliverable is required',
        }),

    locations: Joi.array()
        .items(
            Joi.object({
                country_id: Joi.number().required(),
                state_id: Joi.number().required(),
                city_id: Joi.number().allow(null),
                radius_miles: Joi.number().required(),
            })
        ),
    demographics: Joi.object({
        use_gender: Joi.boolean().required(),
        percent_male: Joi.number().required(),
        percent_female: Joi.number().required(),
        age_range_ids: Joi.array(),
    }),

    ad_campaign_payment_type_id: Joi.number().integer().positive().optional(),

    price: Joi.number().precision(2).min(0).optional()
        .messages({
            'number.min': 'Price cannot be negative',
            'number.precision': 'Price must have max 2 decimal places',
        }),

    is_test: Joi.boolean().optional().default(false),
    published: Joi.boolean().default(false),
    is_approval_required: Joi.boolean().default(false),

    is_matching: Joi.boolean().allow(null).optional(),
    content_link: Joi.string().allow(null),

    archived: Joi.boolean().allow(null).optional().default(false),

    story_impressions_min: Joi.number().integer().allow(null).min(0).default(0),
    story_impressions_max: Joi.number().integer().allow(null).min(0).default(0)
        .custom((value, helpers) => {
            const min = helpers.state.ancestors[0].story_impressions_min;
            if (min > value) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .messages({
            'any.invalid': 'story_impressions_max must be ≥ story_impressions_min',
        }),

    meta: Joi.object().optional().unknown(true),
    user_id: Joi.number().integer().positive().optional().allow(null),
});

export const validateUpdateCampaign = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': 'Campaign name is required',
        }),

    description: Joi.string().trim().max(5000)
        .messages({
            'string.max': 'Description cannot exceed 5000 characters',
        }),

    platform: Joi.string()
        .valid('instagram', 'tiktok')
        .required()
        .messages({
            'any.only': 'Platform must be instagram or tiktok',
            'any.required': 'Platform is required',
        }),

    follower_min: Joi.number().integer().min(0).allow(null)
        .messages({
            'number.min': 'Minimum followers cannot be negative',
        }),

    follower_max: Joi.number().integer().min(0).allow(null)
        .custom((value, helpers) => {
            const min = helpers.state.ancestors[0].follower_min;
            if (min !== undefined && value < min) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .messages({
            'any.invalid': 'follower_max must be ≥ follower_min',
        }),

    likes_min: Joi.number().integer().min(0).allow(null),
    likes_max: Joi.number().integer().min(0).allow(null)
        .custom((value, helpers) => {
            const min = helpers.state.ancestors[0].likes_min;
            if (min !== undefined && value < min) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .messages({
            'any.invalid': 'likes_max must be ≥ likes_min',
        }),

    ad_campaign_engagement_range_id: Joi.number().positive().required()
        .messages({
            'number.base': 'Engagement range ID must be a number',
            'any.required': 'Engagement range is required',
        }),

    matcher_run_at: Joi.date().iso().allow(null),
    draft_date: Joi.date().iso().allow(null),
    publish_from: Joi.date().iso().required()
        .messages({
            'date.format': 'publish_from must be in ISO format (YYYY-MM-DDTHH:mm:ssZ)',
            'any.required': 'Start date is required',
        }),

    publish_until: Joi.date().optional().allow("").allow(null).iso().min(Joi.ref('publish_from'))
        .messages({
            'date.min': 'publish_until must be after publish_from',
            'date.format': 'publish_until must be in ISO format',
        }),

    ad_campaign_deliverable_id: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'Deliverable ID must be a number',
            'any.required': 'Deliverable is required',
        }),

    locations: Joi.array()
        .items(
            Joi.object({
                country_id: Joi.number().required(),
                state_id: Joi.number().required(),
                city_id: Joi.number().allow(null),
                radius_miles: Joi.number().required(),
            })
        ),
    demographics: Joi.object({
        use_gender: Joi.boolean().required(),
        percent_male: Joi.number().required(),
        percent_female: Joi.number().required(),
        age_range_ids: Joi.array(),
    }),

    ad_campaign_payment_type_id: Joi.number().integer().positive().optional(),
    is_test: Joi.boolean().optional().default(false),
    published: Joi.boolean().default(false),
    is_approval_required: Joi.boolean().default(false),

    is_matching: Joi.boolean().allow(null).optional(),
    content_link: Joi.string().allow(null),

    archived: Joi.boolean().allow(null).optional().default(false),

    story_impressions_min: Joi.number().integer().allow(null).min(0).default(0),
    story_impressions_max: Joi.number().integer().allow(null).min(0).default(0)
        .custom((value, helpers) => {
            const min = helpers.state.ancestors[0].story_impressions_min;
            if (min > value) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .messages({
            'any.invalid': 'story_impressions_max must be ≥ story_impressions_min',
        }),

    meta: Joi.object().optional().unknown(true),
    user_id: Joi.number().integer().positive().optional().allow(null),
});