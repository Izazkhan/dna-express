import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const AdCampaignAgeRange = sequelize.define('AdCampaignAgeRange', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'ad_campaign_age_ranges',
  timestamps: false,
});

export default AdCampaignAgeRange;