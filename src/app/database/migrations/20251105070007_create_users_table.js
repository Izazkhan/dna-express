'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        CREATE TYPE user_role AS ENUM ('advertiser', 'influencer', 'admin');
        CREATE TABLE IF NOT EXISTS users (
            id              INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            name            VARCHAR(50) NOT NULL,
            email           VARCHAR(255) NULL,
            password        VARCHAR(255) NOT NULL,
            
            fb_user_id      VARCHAR(255) NULL,
            role            user_role NOT NULL DEFAULT 'advertiser',
            
            created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_fb_user_id_unique ON users (fb_user_id);
        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique ON users (username);
        CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
    `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        DROP TABLE IF EXISTS users CASCADE;
    `);
    }
};