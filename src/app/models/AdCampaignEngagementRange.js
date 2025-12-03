import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const AdCampaignEngagementRange = sequelize.define('AdCampaignEngagementRange', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  lower: {
    type: DataTypes.FLOAT
  },
  upper: {
    type: DataTypes.FLOAT
  },
  order: {
    type: DataTypes.INTEGER,
  },
  label: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'ad_campaign_engagement_ranges',
  timestamps: false,
});

export default AdCampaignEngagementRange;