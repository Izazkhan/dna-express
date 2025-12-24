import { DataTypes, literal, Op } from 'sequelize';
import { sequelize } from '../../config/database.js';
import AdCampaignState from './AdCampaignState.js';

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
    scopes: {
        withActiveState: {
            where: literal(`(
                ad_campaign_state_id >= (SELECT id FROM ad_campaign_states WHERE slug = 'offered') 
                AND ad_campaign_state_id < (SELECT id FROM ad_campaign_states WHERE slug = 'completed')
            )`)
        },
        withAcceptedState: {
            where: literal(`(
                ad_campaign_state_id = (SELECT id FROM ad_campaign_states WHERE slug = 'accepted') 
            )`)
        },
        withRejectedState: {
            where: literal(`(
                ad_campaign_state_id <= (SELECT id FROM ad_campaign_states WHERE slug = 'accepted')
                AND rejected = true
            )`)
        },
        withCompletedState: {
            where: literal(`(
                ad_campaign_state_id = (SELECT id FROM ad_campaign_states WHERE slug = 'completed')
            )`)
        },
    }
});

AdCampaignIgbAccountUser.associate = (models) => {
    AdCampaignIgbAccountUser.belongsTo(models.AdCampaign, {
        foreignKey: 'ad_campaign_id',
        as: 'ad_campaign'
    });

    AdCampaignIgbAccountUser.belongsTo(models.AdCampaignState, {
        foreignKey: 'ad_campaign_state_id',
        as: 'ad_campaign_state'
    });

    AdCampaignIgbAccountUser.belongsTo(models.IgbAccount, {
        foreignKey: 'igb_account_id',
        as: 'igb_account'
    });
}

export default AdCampaignIgbAccountUser;