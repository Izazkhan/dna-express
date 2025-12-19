import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const AdCampaignIgbAccountUser = sequelize.define('AdCampaignIgbAccountUser', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    ad_campaign_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    igb_account_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    ad_campaign_state_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    viewed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    publish_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    rejected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    ig_post_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    ig_story_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    is_defaulted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    }
}, {
    tableName: 'ad_campaign_igb_account_user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

AdCampaignIgbAccountUser.associate = (models) => {
    AdCampaignIgbAccountUser.belongsTo(models.AdCampaign, {
        foreignKey: 'ad_campaign_id',
        as: 'ad_campaign'
    });
    
    AdCampaignIgbAccountUser.belongsTo(models.AdCampaignState, {
        foreignKey: 'ad_campaign_id',
        as: 'ad_campaign_state'
    });
}

export default AdCampaignIgbAccountUser;