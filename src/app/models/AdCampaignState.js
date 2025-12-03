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

export default AdCampaignState;