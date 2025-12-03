import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const AdCampaignTransaction = sequelize.define('AdCampaignTransaction', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    ad_campaign_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    igb_account_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fee: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    transaction_fee: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    platform_fee: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    extra_fee: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    currency: {
        type: DataTypes.STRING(8),
        allowNull: false,
        defaultValue: 'USD'
    },
    payment_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.STRING(15), // paid, pending
        allowNull: false,
    }
}, {
    tableName: 'ad_campaign_transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default AdCampaignTransaction;