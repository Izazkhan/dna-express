// models/AdCampaign.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import User from './User.js';

const AdCampaign = sequelize.define('AdCampaign', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: 'Foreign key to users table',
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Campaign name is required' },
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    published: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isIn: [[0, 1]],
        },
    },
    is_matching: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    matcher_run_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_test: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    platform: {
        type: DataTypes.STRING(32),
        allowNull: true,
        validate: {
            isIn: {
                args: [['instagram', 'tiktok']],
                msg: 'Invalid platform',
            },
        },
    },
    follower_min: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 0 },
    },
    follower_max: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 0 },
    },
    likes_min: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 0 },
    },
    likes_max: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 0 },
    },
    ad_campaign_engagement_range_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    publish_from: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    publish_until: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isAfterPublishFrom(value) {
                if (value === null || value === undefined) return;

                if (this.publish_from && new Date(value) <= new Date(this.publish_from)) {
                    throw new Error('publish_until must be after publish_from');
                }
            },
        },
    },
    ad_campaign_deliverable_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    ad_campaign_payment_type_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        defaultValue: 0.00,
        validate: {
            isDecimal: true,
            min: { args: [0], msg: 'Price cannot be negative' },
        },
    },
    draft_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    archived: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    // impressions_cap: {
    //     type: DataTypes.BIGINT,
    //     allowNull: true,
    //     validate: { min: 0 },
    // },
    story_impressions_min: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: { min: 0 },
    },
    story_impressions_max: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: { min: 0 },
    },
    is_approval_required: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    meta: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    content_link: {
        type: DataTypes.STRING,
        allowNull: true,
        // },
        // impressions_cap_state: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        //     defaultValue: 0,
        //     validate: { isInt: true },
    }
}, {
    tableName: 'ad_campaigns',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

AdCampaign.associate = (models) => {
    AdCampaign.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    AdCampaign.hasOne(models.AdCampaignDemographic, {
        foreignKey: 'ad_campaign_id',
        as: 'demographics'
    });

    AdCampaign.hasMany(models.AdCampaignLocation, {
        foreignKey: 'ad_campaign_id',
        as: 'locations'
    });

    AdCampaign.belongsTo(models.AdCampaignDeliverable, {
        foreignKey: 'ad_campaign_deliverable_id',
        as: 'deliverable'
    });

    AdCampaign.belongsTo(models.AdCampaignEngagementRange, {
        foreignKey: 'ad_campaign_engagement_range_id',
        as: 'engagement_rate'
    });
};


export default AdCampaign;