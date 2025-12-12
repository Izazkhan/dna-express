'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ig_latest_demographic_insights (
                id                      BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                igb_account_id          BIGINT REFERENCES igb_accounts (id),
                percent_female          FLOAT,
                percent_male            FLOAT,
                percent_unspecified     FLOAT,
                percent_13_17           FLOAT,
                percent_18_24           FLOAT,
                percent_25_34           FLOAT,
                percent_35_44           FLOAT,
                percent_45_54           FLOAT,
                percent_55_up           FLOAT,
                followers_count         BIGINT,
                
                percent_male_binary     FLOAT,
                percent_female_binary   FLOAT,
                binary_total            BIGINT,
                
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS ig_latest_demographic_insights
        `);
    }
};