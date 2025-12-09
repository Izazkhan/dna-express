'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS ig_post_insight_metrics (
                id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                ig_post_id  BIGINT REFERENCES ig_posts (id),
                engagement  DECIMAL(20,4),
                impressions BIGINT,
                reach       BIGINT,
                saved       INTEGER,
                video_views BIGINT,
                shares      INTEGER,
                plays       BIGINT
            )
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TABLE IF EXISTS ig_post_insight_metrics
        `);
    }
};