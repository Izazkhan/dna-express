'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        CREATE TABLE IF NOT EXISTS users (
            id              INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            name            VARCHAR(50) NOT NULL,
            email           VARCHAR(255) NOT NULL UNIQUE,
            password        VARCHAR(255) NOT NULL,
            access_token    VARCHAR(255) DEFAULT NULL,
            created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        DROP TABLE IF EXISTS users CASCADE;
    `);
    }
};