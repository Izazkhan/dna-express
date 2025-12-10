import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const IgPostInsightMetric = sequelize.define('IgPostInsightMetric', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    ig_post_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    engagement: {
        type: DataTypes.DECIMAL(10,4),
        allowNull: true,
    },
    views: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    reach: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    saved: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    shares: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    comments: {
        type: DataTypes.BIGINT,
        allowNull: true
    }
}, {
    tableName: 'ig_post_insight_metrics',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default IgPostInsightMetric;
