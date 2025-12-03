'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS password_resets (
                id          INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                token       VARCHAR(61) NOT NULL,
                expires_in  TIMESTAMP WITH TIME ZONE NOT NULL,
                user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
                
            );

            CREATE INDEX idx_password_resets_token ON password_resets(token);
            CREATE INDEX idx_user ON password_resets(user_id);
        `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        DROP TABLE IF EXISTS password_resets;
    `);
    }
};