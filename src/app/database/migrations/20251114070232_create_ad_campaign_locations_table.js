'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ad_campaign_locations (
                id              integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                ad_campaign_id  integer REFERENCES ad_campaigns (id),
                data_country_id integer NOT NULL REFERENCES data_countries (id),
                data_state_id   integer NULL REFERENCES data_states (id),
                data_city_id    integer NULL REFERENCES data_cities (id),
                radius_miles    integer DEFAULT 5
            )
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS ad_campaign_locations
        `);
    }
};