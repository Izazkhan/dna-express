'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ig_story_insights (
                id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                igb_account_id  BIGINT REFERENCES igb_accounts (id),
                followers_count INTEGER,
                engagement      DECIMAL(10,4),
                impressions     BIGINT,
                likes           BIGINT,
                comments        INTEGER,
                saves           BIGINT,
                posts           BIGINT,
                reach           BIGINT
            )
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS ig_story_insights
        `);
    }
};