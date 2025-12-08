'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        CREATE TABLE IF NOT EXISTS users (
            id              INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            name            VARCHAR(50) NULL,
            username        VARCHAR(50) NULL,
            email           VARCHAR(255) NULL,
            password        VARCHAR(255) NULL,
            refresh_token   VARCHAR(255) NULL,
            
            fb_user_id      VARCHAR(255) NULL,
            access_token    VARCHAR(255) NULL,
            
            created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

            UNIQUE(email, fb_user_id)
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_fb_user_id_unique ON users (fb_user_id);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);
    `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        DROP TABLE IF EXISTS users CASCADE;
    `);
    }
};