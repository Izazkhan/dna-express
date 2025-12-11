import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const AdCampaignLocation = sequelize.define('AdCampaignLocation', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    ad_campaign_id: {
        type: DataTypes.BIGINT
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
    radius_miles: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'ad_campaign_locations',
    timestamps: false,
});

AdCampaignLocation.associate = (models) => {
    AdCampaignLocation.belongsTo(models.AdCampaign, {
        foreignKey: 'ad_campaign_id',
        as: 'ad_campaign'
    });

    AdCampaignLocation.belongsTo(models.DataCountry, {
        foreignKey: 'data_country_id',
        as: 'country'
    });

    AdCampaignLocation.belongsTo(models.DataState, {
        foreignKey: 'data_state_id',
        as: 'state'
    });

    AdCampaignLocation.belongsTo(models.DataCity, {
        foreignKey: 'data_city_id',
        as: 'city'
    });
};


export default AdCampaignLocation;