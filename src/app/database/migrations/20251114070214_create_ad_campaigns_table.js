'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ad_campaigns (
                id              BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                user_id         BIGINT references users(id) NULL,
                published       BOOLEAN DEFAULT FALSE,
                is_matching     BOOLEAN DEFAULT FALSE,
                is_test         BOOLEAN DEFAULT FALSE,
                name            VARCHAR(255) NOT NULL,
                platform        VARCHAR(32),
                follower_min    INTEGER,
                follower_max    INTEGER,
                likes_min       INTEGER,
                likes_max       INTEGER,
                content_link    VARCHAR NULL,
                ad_campaign_engagement_range_id INTEGER NOT NULL,
                publish_from    timestamptz NOT NULL DEFAULT NOW(),
                publish_until   timestamptz NULL,
                ad_campaign_deliverable_id INTEGER NOT NULL,
                ad_campaign_payment_type_id INTEGER,
                price integer   DEFAULT 0.00 CHECK (price >= 0),
                description     TEXT,
                archived        BOOLEAN DEFAULT FALSE,
                impressions_cap BIGINT DEFAULT NULL,
                story_impressions_min INTEGER DEFAULT NULL,
                story_impressions_max INTEGER DEFAULT NULL,
                is_approval_required boolean DEFAULT NULL,
                meta JSON,
                impressions_cap_state INTEGER DEFAULT 0,
                draft_date      timestamptz,
                created_at      timestamptz,
                updated_at      timestamptz
            );

            -- Indexes for performance
            CREATE INDEX IF NOT EXISTS idx_ad_campaigns_published ON ad_campaigns(published);
            CREATE INDEX IF NOT EXISTS idx_ad_campaigns_platform ON ad_campaigns(platform);
            CREATE INDEX IF NOT EXISTS idx_ad_campaigns_publish_from ON ad_campaigns(publish_from);
        `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.sequelize.query(`
        DROP TABLE IF EXISTS ad_campaigns;
    `);
    }
};