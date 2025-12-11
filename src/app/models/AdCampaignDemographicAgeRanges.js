import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const AdCampaignDemographicAgeRanges = sequelize.define('AdCampaignDemographicAgeRanges', {
    ad_campaign_demographic_id: {
        type: DataTypes.BIGINT
    },
    age_range_id: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'ad_campaign_demographic_age_ranges',
    timestamps: false,
});

AdCampaignDemographicAgeRanges.associate = (models) => {
    AdCampaignDemographicAgeRanges.belongsTo(models.AdCampaignDemographic, {
        foreignKey: 'ad_campaign_demographic_id',
        as: 'demographic'
    });

    AdCampaignDemographicAgeRanges.belongsTo(models.AdCampaignAgeRange, {
        foreignKey: 'age_range_id',
        as: 'age_range'
    });
};


export default AdCampaignDemographicAgeRanges;