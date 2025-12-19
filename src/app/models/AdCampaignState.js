import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const AdCampaignState = sequelize.define('AdCampaignState', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING
  },
  slug: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'ad_campaign_states',
  timestamps: false,
});

AdCampaignState.idBySlug = async function (slug) {
  const row = await AdCampaignState.findOne({
    where: { slug },
    attributes: ['id']
  });

  return row ? row.id : null;
};

AdCampaignState.matchedId = () => AdCampaignState.idBySlug('matched');
AdCampaignState.acceptedId = () => AdCampaignState.idBySlug('accepted');
AdCampaignState.offeredId = () => AdCampaignState.idBySlug('offered');
AdCampaignState.contractedId = () => AdCampaignState.idBySlug('contract');
AdCampaignState.approvedId = () => AdCampaignState.idBySlug('approved');
AdCampaignState.publishedId = () => AdCampaignState.idBySlug('published');
AdCampaignState.draftedId = () => AdCampaignState.idBySlug('drafted');
AdCampaignState.completedId = () => AdCampaignState.idBySlug('completed');

export default AdCampaignState;