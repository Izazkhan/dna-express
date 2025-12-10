import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const InstagramStoryInsightMetric = sequelize.define('InstagramStoryInsightMetric', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    ig_story_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    views: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    reach: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    taps_forward: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    taps_back: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    replies: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    exits: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default InstagramStoryInsightMetric;