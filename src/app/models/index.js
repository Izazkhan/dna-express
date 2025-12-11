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

const models = {
    User,
    PasswordReset,
    DataCountry,
    DataState,
    DataCity,
    AdCampaignLocation,
    AdCampaign,
    AdCampaignDeliverable,
    AdCampaignDemographic,
    AdCampaignDemographicAgeRanges,
    AdCampaignAgeRange,
    AdCampaignEngagementRange,
    IgbAccount,
    IgPost,
    IgPostInsightMetric,
    IgStory,
    IgStoryInsightMetric,
    IgProfileAverageInsights,
}

Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

export default models;