import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const AdCampaignLocation = sequelize.define('AdCampaignLocation', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    ad_campaign_id: {
        type: DataTypes.BIGINT.UNSIGNED
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

export default AdCampaignLocation;