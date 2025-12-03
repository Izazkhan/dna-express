import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const AdCampaignLocation = sequelize.define('AdCampaignLocation', {
    ad_campaign_id: {
        type: DataTypes.BIGINT.UNSIGNED
    },
    data_country_id: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    data_state_id: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    data_city_id: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    radius_miles: {
        type: DataTypes.INTEGER.UNSIGNED
    }
}, {
    tableName: 'ad_campaign_locations',
    timestamps: false,
});

export default AdCampaignLocation;