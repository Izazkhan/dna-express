import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const AdCampaignDemographicAgeRanges = sequelize.define('AdCampaignDemographicAgeRanges', {
    ad_campaign_demographic_id: {
        type: DataTypes.BIGINT.UNSIGNED
    },
    age_range_id: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'ad_campaign_demographic_age_ranges',
    timestamps: false,
});
export default AdCampaignDemographicAgeRanges;