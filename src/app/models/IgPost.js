import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const IgPost = sequelize.define('IgPost', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    igb_account_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    fb_post_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    likes: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    comments: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    permalink: {
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
        type: DataTypes.STRING(2200),
        allowNull: true
    },
    video_title: {
        type: DataTypes.STRING(1024),
        allowNull: true
    },
    media_product_type: {
        type: DataTypes.STRING(16),
        allowNull: true
    }
}, {
    tableName: 'ig_posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

IgPost.associate = (models) => {
    IgPost.belongsTo(models.IgbAccount, {
        foreignKey: 'igb_account_id',
        as: 'igb_account'
    });

    IgPost.hasOne(models.IgPostInsightMetric, {
        foreignKey: 'ig_post_id',
        as: 'insights'
    });
};


export default IgPost;