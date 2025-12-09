'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ig_posts (
                id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                igb_account_id      BIGINT REFERENCES igb_accounts (id),
                is_active           BOOLEAN NULL,
                fb_post_id          VARCHAR(255) NOT NULL,
                likes               BIGINT,
                comments            BIGINT,
                permalink           VARCHAR(255),
                media_type          VARCHAR(16),
                media_url           VARCHAR(1024),
                thumbnail_url       VARCHAR(1024),
                caption             VARCHAR(2200),
                video_title         VARCHAR(1024),
                media_product_type  VARCHAR(16)
            )
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS ig_posts
        `);
    }
};