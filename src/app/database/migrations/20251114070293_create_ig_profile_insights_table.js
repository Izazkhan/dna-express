'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ig_profile_insights (
                id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                igb_account_id  BIGINT REFERENCES igb_accounts (id),
                followers_count INTEGER,
                follows_count   INTEGER,
                media_count     INTEGER,

                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS ig_profile_insights
        `);
    }
};