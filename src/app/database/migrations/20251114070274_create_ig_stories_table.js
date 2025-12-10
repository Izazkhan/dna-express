'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ig_stories (
                id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                igb_account_id  BIGINT REFERENCES igb_accounts (id),
                fb_story_id     VARCHAR(255),
                likes           INTEGER,
                comments        INTEGER,
                permalink       VARCHAR(255),
                shortcode       VARCHAR(255),
                media_type      VARCHAR(16),
                media_url       VARCHAR(1024),
                thumbnail_url   VARCHAR(1024),
                caption         VARCHAR(1024),

                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS ig_stories
        `);
    }
};