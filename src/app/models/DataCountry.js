import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const DataCountry = sequelize.define('DataCountry', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    iso3: {
        type: DataTypes.STRING(6),
        allowNull: false,
    },
    latitude: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
    },
    longitude: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
    },
    emoji: {
        type: DataTypes.STRING(4),
        allowNull: true,
    },
    emojiu: {
        type: DataTypes.STRING(16),
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'data_countries',
    timestamps: false
});

DataCountry.associate = (models) => {
    DataCountry.hasMany(models.DataState, {
        foreignKey: 'data_country_id',
        as: 'states'
    });
};


export default DataCountry;