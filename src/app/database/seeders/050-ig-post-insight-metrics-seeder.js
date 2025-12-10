'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        // Fetch all IgPost IDs + media_type so insight generation can be realistic
        const posts = await queryInterface.sequelize.query(
            `SELECT id, media_type FROM ig_posts ORDER BY id ASC;`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const insights = [];

        for (const post of posts) {
            const isVideo =
                post.media_type === 'VIDEO' ||
                post.media_type === 'CAROUSEL_ALBUM' && Math.random() < 0.3; // 30% carousel videos

            const views = Math.floor(500 + Math.random() * 10000);  // 500–10k
            const likes = Math.floor(500 + Math.random() * 10000);  // 500–10k
            const reach = Math.floor(views * (0.6 + Math.random() * 0.3));  // 60–90% of views
            const saved = Math.floor(Math.random() * 200);  // 0–200 saves
            const shares = Math.floor(Math.random() * 100); // 0–100 shares
            const comments = Math.floor(Math.random() * 1000); // 0–100 shares


            // Engagement rate approximation: (likes + comments + saves + shares) / reach
            const engagement =
                reach > 0
                    ? Number(((likes + saved + shares + comments) * 100 / reach).toFixed(4))
                    : 0;

            insights.push({
                ig_post_id: post.id,
                engagement,
                views,
                likes,
                comments,
                reach,
                saved,
                shares
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
