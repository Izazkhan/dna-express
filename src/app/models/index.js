import AdCampaign from './AdCampaign.js';
import AdCampaignAgeRange from './AdCampaignAgeRange.js';
import AdCampaignDeliverable from './AdCampaignDeliverable.js';
import AdCampaignDemographic from './AdCampaignDemographic.js';
import AdCampaignDemographicAgeRanges from './AdCampaignDemographicAgeRanges.js';
import AdCampaignEngagementRange from './AdCampaignEngagementRange.js';
import AdCampaignLocation from './AdCampaignLocation.js';
import DataCity from './DataCity.js';
import DataCountry from './DataCountry.js';
import DataState from './DataState.js';
import IgbAccount from './IgbAccount.js';
import PasswordReset from './PasswordReset.js';
import User from './User.js';
import IgPost from './IgPost.js';
import IgPostInsightMetric from './IgPostInsightMetric.js';
import IgStory from './IgStory.js';
import IgStoryInsightMetric from './IgStoryInsightMetric.js';
import IgProfileAverageInsights from './IgProfileAverageInsights.js';

PasswordReset.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(PasswordReset, { foreignKey: 'user_id', as: 'passwordReset' });

DataCountry.hasMany(DataState, { foreignKey: 'data_country_id', as: 'state' });
DataState.hasMany(DataCity, { foreignKey: 'data_state_id', as: 'city' });

DataCity.belongsTo(DataState, { foreignKey: 'data_state_id', as: 'state' });
DataState.belongsTo(DataCountry, { foreignKey: 'data_country_id', as: 'country' });

User.hasMany(IgbAccount, { foreignKey: 'user_id', as: 'igb_accounts' });
IgbAccount.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(AdCampaign, { foreignKey: 'user_id', as: 'campaigns' });
AdCampaign.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

AdCampaign.hasOne(AdCampaignDemographic, { foreignKey: 'ad_campaign_id', as: 'demographics' });
// AdCampaignDemographic.belongsTo(AdCampaign, { foreignKey: 'ad_campaign_id', as: 'ad_campaign' });

AdCampaignDemographic.hasMany(AdCampaignDemographicAgeRanges, {
    foreignKey: "ad_campaign_demographic_id",
    as: "age_range_ids"
});

AdCampaignDemographic.belongsToMany(AdCampaignAgeRange, {
    through: AdCampaignDemographicAgeRanges,
    foreignKey: "ad_campaign_demographic_id",
    otherKey: "age_range_id",
    as: "age_ranges"
});

AdCampaign.hasMany(AdCampaignLocation, { foreignKey: 'ad_campaign_id', as: 'locations' });

AdCampaign.belongsTo(AdCampaignDeliverable, { foreignKey: 'ad_campaign_deliverable_id', as: 'deliverable' });
AdCampaign.belongsTo(AdCampaignEngagementRange, { foreignKey: 'ad_campaign_engagement_range_id', as: 'engagement_rate' });

AdCampaignLocation.belongsTo(AdCampaign, { foreignKey: 'ad_campaign_id', as: 'ad_campaign' });

AdCampaignLocation.belongsTo(DataCountry, {
    foreignKey: "data_country_id",
    as: "country",
});

AdCampaignLocation.belongsTo(DataState, {
    foreignKey: "data_state_id",
    as: "state",
});

AdCampaignLocation.belongsTo(DataCity, {
    foreignKey: "data_city_id",
    as: "city",
});

export {
    User,
    PasswordReset,
    DataCountry,
    DataState,
    DataCity,
    AdCampaign,
    AdCampaignDemographic,
    IgPost,
    IgPostInsightMetric,
    IgStory,
    IgStoryInsightMetric,
    IgProfileAverageInsights,
}