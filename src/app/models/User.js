import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';
import PasswordReset from './PasswordReset.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Name is required' },
            len: {
                args: [2, 100],
                msg: 'Name must be between 2 and 100 characters',
            },
        },
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
            name: 'idx_users_email',
            msg: 'Email already exists',
        },
        validate: {
            notEmpty: { msg: 'Email is required' },
            isEmail: { msg: 'Must be a valid email address' },
        },
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Password is required' },
            len: {
                args: [6],
                msg: 'Password must be at least 6 characters',
            },
        },
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('advertiser', 'influencer', 'admin'),
        allowNull: false
    }
}, {
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['email'],
        },
    ]
});

User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    delete values.refresh_token;
    return values;
};

export default User;