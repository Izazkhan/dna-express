'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        CREATE TABLE IF NOT EXISTS ad_campaign_igb_account_user (
            id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            ad_campaign_id  BIGINT REFERENCES ad_campaigns (id),
            igb_account_id  BIGINT REFERENCES igb_accounts (id),
            user_id         BIGINT REFERENCES users (id),
            ad_campaign_state_id INTEGER REFERENCES ad_campaign_states (id),
            viewed          BOOLEAN DEFAULT FALSE,
            publish_date    TIMESTAMPTZ,
            rejected        BOOLEAN DEFAULT FALSE,
            platform_id     INTEGER,
            post_id         BIGINT,
            story_id        BIGINT,
            is_defaulted    BOOLEAN NULL DEFAULT FALSE,
            created_at      TIMESTAMPTZ DEFAULT NOW(),
            updated_at      TIMESTAMPTZ DEFAULT NOW()
        );

    `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        DROP TABLE IF EXISTS ad_campaign_igb_account_user CASCADE;
    `);
    }
};