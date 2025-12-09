'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ad_campaign_demographics (
                id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                ad_campaign_id  BIGINT REFERENCES ad_campaigns (id),
                use_gender      BOOLEAN DEFAULT FALSE,
                percent_female  INTEGER DEFAULT 50,
                percent_male    INTEGER DEFAULT 50
            )
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS ad_campaign_demographics_age_ranges CASCADE
        `);
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS ad_campaign_demographics CASCADE
        `);
    }
};