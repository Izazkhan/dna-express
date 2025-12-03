import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const IgbAccountUser = sequelize.define('IgbAccountUser', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    igb_account_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    access_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'igb_account_user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default IgbAccountUser;