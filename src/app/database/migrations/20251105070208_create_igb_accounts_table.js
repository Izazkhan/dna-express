'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        CREATE TABLE IF NOT EXISTS igb_accounts (
            id                   BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            user_id              BIGINT NOT NULL REFERENCES users(id),
            fb_page_id           VARCHAR(255) NULL,
            instagram_account_id VARCHAR(255) NOT NULL,
            name                 VARCHAR(255) NOT NULL,
            username             VARCHAR(255) NOT NULL,
            profile_picture_url  VARCHAR(1024) NULL,
            website              VARCHAR(1024) DEFAULT NULL,
            is_profile           BOOLEAN DEFAULT TRUE,
            is_tag_generator     BOOLEAN DEFAULT FALSE,
            is_active            BOOLEAN DEFAULT TRUE,
            is_featured          BOOLEAN NULL DEFAULT FALSE,
            featured_date        TIMESTAMPTZ NULL,
            created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        DROP TABLE IF EXISTS igb_accounts CASCADE;
    `);
    }
};