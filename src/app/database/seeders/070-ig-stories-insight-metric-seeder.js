'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {

        const stories = await queryInterface.sequelize.query(
            `SELECT id, media_type FROM ig_stories ORDER BY id ASC;`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const insights = [];

        for (const story of stories) {

            const baseViews = Math.floor(500 + Math.random() * 7000);

            insights.push({
                ig_story_id: story.id,
                views: baseViews,
                reach: Math.floor(baseViews * (0.7 + Math.random() * 0.2)), // 70–90%
                taps_forward: Math.floor(Math.random() * 80),
                taps_back: Math.floor(Math.random() * 20),
                replies: Math.floor(Math.random() * 40),
                exits: Math.floor(Math.random() * 30),
                created_at: new Date(),
                updated_at: new Date()
            });
        }

        await queryInterface.bulkInsert('ig_story_insight_metrics', insights, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('ig_story_insight_metrics', null, {});
    }
};
