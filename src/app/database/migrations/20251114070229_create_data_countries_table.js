'use strict';
module.exports = {
    // IMPORTANT: to load data to this table
    // run command:
    // dna_staging=> \copy data_countries FROM '/home/izazkhan/Downloads/data_countries.csv' WITH (FORMAT csv, HEADER true);
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS data_countries (
                id           BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                name         VARCHAR(64) NOT NULL,
                iso3         VARCHAR(6) NOT NULL,
                latitude     DOUBLE PRECISION DEFAULT 0,
                longitude    DOUBLE PRECISION DEFAULT 0,
                emoji        VARCHAR(16), 
                emoji_u      VARCHAR(32),
                created_at   TIMESTAMPTZ DEFAULT NOW(),
                updated_at   TIMESTAMPTZ DEFAULT NOW()
            )
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS data_countries
        `);
    }
};