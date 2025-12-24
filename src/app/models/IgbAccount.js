import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import User from './User.js';

const IgbAccount = sequelize.define('IgbAccount', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    fb_page_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    instagram_account_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    profile_picture_url: {
        type: DataTypes.STRING(1024),
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING(1024),
        allowNull: true,
        defaultValue: null,
    },
    is_profile: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    is_tag_generator: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    featured_date: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'igb_accounts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    scopes: {
        withUser: {
            include: 'user'
        }
    }
});

IgbAccount.associate = (models) => {
    IgbAccount.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    IgbAccount.hasMany(models.IgPost, {
        foreignKey: 'igb_account_id',
        as: 'posts'
    });

    IgbAccount.hasMany(models.IgStory, {
        foreignKey: 'igb_account_id',
        as: 'stories'
    });

    IgbAccount.hasOne(models.IgProfileInsights, {
        foreignKey: 'igb_account_id',
        as: 'profile_insights'
    });

    IgbAccount.hasOne(models.IgProfileAverageInsights, {
        foreignKey: 'igb_account_id',
        as: 'profile_average_insights'
    });

    IgbAccount.hasOne(models.IgLatestDemographicInsights, {
        foreignKey: 'igb_account_id',
        as: 'demographics'
    });
    
    IgbAccount.hasMany(models.IgLatestAudienceCityCounts, {
        foreignKey: 'igb_account_id',
        as: 'audience_by_city'
    });
    
    IgbAccount.hasMany(models.AdCampaignIgbAccountUser, {
        foreignKey: 'igb_account_id',
        as: 'matches'
    });
    
    IgbAccount.hasMany(models.AdCampaignIgbAccountUser, {
        foreignKey: 'igb_account_id',
        as: 'proposals'
    });
};


export default IgbAccount;