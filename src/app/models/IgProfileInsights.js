import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const IgProfileInsights = sequelize.define('IgProfileInsights', {
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
    follows_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    media_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: 'ig_profile_insights',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

IgProfileInsights.associate = (models) => {
    IgProfileInsights.belongsTo(models.IgbAccount, {
        foreignKey: 'igb_account_id',
        as: 'igb_account'
    });
};


export default IgProfileInsights;