import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const AdCampaignDeliverable = sequelize.define('AdCampaignDeliverable', {
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
  },
  is_active: {
    type: DataTypes.BOOLEAN
  }
}, {
  tableName: 'ad_campaign_deliverables',
  timestamps: false,
});

export default AdCampaignDeliverable;