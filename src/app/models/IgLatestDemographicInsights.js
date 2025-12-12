import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const IgLatestDemographicInsights = sequelize.define('IgLatestDemographicInsights', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    igb_account_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    percent_female: {
        type: DataTypes.FLOAT
    },
    percent_male: {
        type: DataTypes.FLOAT
    },
    percent_unspecified: {
        type: DataTypes.FLOAT
    },
    percent_13_17: {
        type: DataTypes.FLOAT
    },
    percent_18_24: {
        type: DataTypes.FLOAT
    },
    percent_25_34: {
        type: DataTypes.FLOAT
    },
    percent_35_44: {
        type: DataTypes.FLOAT
    },
    percent_45_54: {
        type: DataTypes.FLOAT
    },
    percent_55_up: {
        type: DataTypes.FLOAT
    },
    followers_count: {
        type: DataTypes.BIGINT
    },
    percent_male_binary: {
        type: DataTypes.FLOAT
    },
    percent_female_binary: {
        type: DataTypes.FLOAT
    },
    binary_total: {
        type: DataTypes.BIGINT
    }
}, {
    tableName: 'ig_latest_demographic_insights',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

IgLatestDemographicInsights.associate = (models) => {
    IgLatestDemographicInsights.belongsTo(models.IgbAccount, {
        foreignKey: 'igb_account_id',
        as: 'igb_account'
    });
};


export default IgLatestDemographicInsights;