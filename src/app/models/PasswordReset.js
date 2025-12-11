import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import User from './User.js';

const PasswordReset = sequelize.define('PasswordReset', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    token: {
        type: DataTypes.CHAR(64),
        allowNull: false,
    },
    expires_in: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    }
}, {
    timestamps: true,
    updatedAt: false,
    underscored: true,
});

PasswordReset.associate = (models) => {
    PasswordReset.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};


export default PasswordReset;