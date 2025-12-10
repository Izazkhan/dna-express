'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        // Fetch posts (so insights match post media_type)
        const posts = await queryInterface.sequelize.query(
            `SELECT id, media_type FROM ig_posts ORDER BY id ASC;`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const insights = [];

        for (const post of posts) {

            // -------------------------
            // REALISTIC IG METRIC MODEL
            // -------------------------

            const isVideo =
                post.media_type === 'VIDEO' ||
                (post.media_type === 'CAROUSEL_ALBUM' && Math.random() < 0.30);

            // IMPRESSIONS (views)
            const views = Math.floor(800 + Math.random() * 30000);
            // reach is usually 60–90% of impressions
            const reach = Math.floor(views * (0.60 + Math.random() * 0.30));

            // Likes strongly correlate with reach
            const likes = Math.floor(reach * (0.01 + Math.random() * 0.06));
            // (1% – 7% typical engagement)

            // Comments correlate with likes
            const comments = Math.floor(likes * (0.03 + Math.random() * 0.15));

            // Saves correlate with content quality
            const saved = Math.floor(reach * (0.002 + Math.random() * 0.01));

            // Shares are usually low
            const shares = Math.floor(reach * (0.001 + Math.random() * 0.005));

            // Engagement Rate (industry standard):
            // (likes + comments + saves + shares) / reach * 100
            const engagement =
                reach > 0
                    ? Number(((likes + comments + saved + shares) * 100 / reach).toFixed(4))
                    : 0;

            insights.push({
                ig_post_id: post.id,
                engagement,
                views,
                likes,
                comments,
                reach,
                saved,
                shares,
                created_at: new Date(),
                updated_at: new Date()
            });
        }

        await queryInterface.sequelize.query(
            'TRUNCATE ig_post_insight_metrics RESTART IDENTITY CASCADE;'
        );

        await queryInterface.bulkInsert('ig_post_insight_metrics', insights, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('ig_post_insight_metrics', null, {});
    }
};
