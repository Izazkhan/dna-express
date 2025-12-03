import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const AdCampaignPlatform = sequelize.define('AdCampaignPlatform', {
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
  tableName: 'ad_campaign_platforms',
  timestamps: false,
});

export default AdCampaignPlatform;