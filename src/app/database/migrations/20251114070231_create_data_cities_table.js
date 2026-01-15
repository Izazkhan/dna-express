'use strict';
module.exports = {
    // IMPORTANT: to load data to this table
    // run command:
    // dna_staging=> \copy data_cities FROM '/home/izazkhan/Downloads/data_cities.csv' WITH (FORMAT csv, HEADER true);
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS data_cities (
                id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                data_country_id     BIGINT NOT NULL,
                data_state_id       BIGINT NOT NULL,
                name                VARCHAR(64) NOT NULL,
                latitude            DOUBLE PRECISION DEFAULT 0,
                longitude           DOUBLE PRECISION DEFAULT 0,
                
                created_at          TIMESTAMPTZ DEFAULT NOW(),
                updated_at          TIMESTAMPTZ DEFAULT NOW()
            )
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS data_cities
        `);
    }
};