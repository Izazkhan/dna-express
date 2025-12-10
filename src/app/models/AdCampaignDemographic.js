import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const AdCampaignDemographic = sequelize.define('AdCampaignDemographic', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    ad_campaign_id: {
        type: DataTypes.BIGINT
    }, use_gender: {
        type: DataTypes.BOOLEAN
    }, percent_female: {
        type: DataTypes.INTEGER
    }, percent_male: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'ad_campaign_demographics',
    timestamps: false,
});

export default AdCampaignDemographic;