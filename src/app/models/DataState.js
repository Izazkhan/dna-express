import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/database.js';

const DataState = sequelize.define('DataState', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
    },
    data_country_id: {
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
    tableName: 'data_states',
    timestamps: false
});

DataState.associate = (models) => {
    DataState.belongsTo(models.DataCountry, {
        foreignKey: 'data_country_id',
        as: 'country'
    });

    DataState.hasMany(models.DataCity, {
        foreignKey: 'data_state_id',
        as: 'cities'
    });
};


export default DataState;