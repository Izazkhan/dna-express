'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ig_story_insight_metrics (
                id            BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                ig_story_id   BIGINT REFERENCES ig_stories (id),
                views         BIGINT,
                reach         BIGINT,
                taps_forward  INTEGER,
                taps_back     INTEGER,
                replies       INTEGER,
                exits         INTEGER,

                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS ig_story_insight_metrics
        `);
    }
};