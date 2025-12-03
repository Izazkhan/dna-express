'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ad_campaign_states (
                id          INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                name        varchar(20) not null,
                slug        varchar(20) not null
            );
        `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        DROP TABLE IF EXISTS ad_campaign_states;
    `);
    }
};