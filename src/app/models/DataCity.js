import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const DataCity = sequelize.define('DataCity', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
    },
    data_country_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    data_state_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(64),
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
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'data_cities',
    timestamps: false
});

export default DataCity;