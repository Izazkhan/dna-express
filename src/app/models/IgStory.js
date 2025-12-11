import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const IgStory = sequelize.define('IgStory', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    igb_account_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    fb_story_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    comments: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    permalink: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    shortcode: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    media_type: {
        type: DataTypes.STRING(16),
        allowNull: true
    },
    media_url: {
        type: DataTypes.STRING(1024),
        allowNull: true
    },
    thumbnail_url: {
        type: DataTypes.STRING(1024),
        allowNull: true
    },
    caption: {
        type: DataTypes.STRING(1024),
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

IgStory.associate = (models) => {
    IgStory.belongsTo(models.IgbAccount, {
        foreignKey: 'igb_account_id',
        as: 'igb_account'
    });

    IgStory.hasOne(models.IgStoryInsightMetric, {
        foreignKey: 'ig_story_id',
        as: 'insights'
    });
};


export default IgStory;