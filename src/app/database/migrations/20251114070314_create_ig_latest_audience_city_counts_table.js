'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ig_latest_audience_city_counts (
                id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                igb_account_id  BIGINT REFERENCES igb_accounts (id),
                
                data_country_id INTEGER REFERENCES data_countries (id),
                data_state_id   INTEGER REFERENCES data_states (id),
                data_city_id    INTEGER REFERENCES data_cities (id),
                
                value           INTEGER NOT NULL,
                
                created_at      TIMESTAMPTZ DEFAULT NOW(),
                updated_at      TIMESTAMPTZ DEFAULT NOW()
            )
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS ig_latest_audience_city_counts
        `);
    }
};