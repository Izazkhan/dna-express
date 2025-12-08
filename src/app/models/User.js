import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    fb_user_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    access_token: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['email', 'fb_user_id'],
        },
    ],
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    defaultScope: {
        attributes: { exclude: ['access_token', 'refresh_token', 'password'] }
    },
    scopes: {
        withTokens: {
            attributes: { include: ['refresh_token', 'access_token'] }
        },
        withPassword: {
            attributes: { include: ['password'] }
        },
    }
});

User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    delete values.refresh_token;
    delete values.access_token;
    return values;
};

export default User;