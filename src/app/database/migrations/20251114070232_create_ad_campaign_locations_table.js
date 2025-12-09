'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ad_campaign_locations (
                id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                ad_campaign_id  BIGINT REFERENCES ad_campaigns (id),
                data_country_id INTEGER NOT NULL REFERENCES data_countries (id),
                data_state_id   INTEGER NULL REFERENCES data_states (id),
                data_city_id    INTEGER NULL REFERENCES data_cities (id),
                radius_miles    INTEGER DEFAULT 5
            )
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS ad_campaign_locations
        `);
    }
};