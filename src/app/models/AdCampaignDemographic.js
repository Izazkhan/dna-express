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

AdCampaignDemographic.associate = (models) => {
    AdCampaignDemographic.belongsTo(models.AdCampaign, {
        foreignKey: 'ad_campaign_id',
        as: 'ad_campaign'
    });

    AdCampaignDemographic.hasMany(models.AdCampaignDemographicAgeRanges, {
        foreignKey: 'ad_campaign_demographic_id',
        as: 'age_range_ids'
    });

    AdCampaignDemographic.belongsToMany(models.AdCampaignAgeRange, {
        through: models.AdCampaignDemographicAgeRanges,
        foreignKey: 'ad_campaign_demographic_id',
        otherKey: 'age_range_id',
        as: 'age_ranges'
    });
};


export default AdCampaignDemographic;