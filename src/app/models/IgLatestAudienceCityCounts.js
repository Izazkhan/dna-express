import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const IgLatestAudienceCityCounts = sequelize.define('IgLatestAudienceCityCounts', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    igb_account_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    data_country_id: {
        type: DataTypes.INTEGER
    },
    data_state_id: {
        type: DataTypes.INTEGER
    },
    data_city_id: {
        type: DataTypes.INTEGER
    },
    value: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'ig_latest_audience_city_counts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

IgLatestAudienceCityCounts.associate = (models) => {
    IgLatestAudienceCityCounts.belongsTo(models.IgbAccount, {
        foreignKey: 'igb_account_id',
        as: 'igb_account'
    });
};


export default IgLatestAudienceCityCounts;