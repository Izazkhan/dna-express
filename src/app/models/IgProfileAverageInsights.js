import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const IgProfileAverageInsights = sequelize.define('IgProfileAverageInsights', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    igb_account_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    followers_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    engagement: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: true
    },
    views: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    likes: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    comments: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    saves: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    posts: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    reach: {    
        type: DataTypes.BIGINT,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default IgProfileAverageInsights;