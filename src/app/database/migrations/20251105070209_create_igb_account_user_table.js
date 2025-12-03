'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        CREATE TABLE IF NOT EXISTS igb_account_user (
            id              INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            igb_account_id  BIGINT REFERENCES igb_accounts (id),
            user_id         BIGINT REFERENCES users (id),
            access_token    VARCHAR(255) NULL,
            is_active       BOOLEAN DEFAULT TRUE,
            created_at      TIMESTAMPTZ DEFAULT NOW(),
            updated_at      TIMESTAMPTZ DEFAULT NOW()
        );

    `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        DROP TABLE IF EXISTS igb_account_user CASCADE;
    `);
    }
};