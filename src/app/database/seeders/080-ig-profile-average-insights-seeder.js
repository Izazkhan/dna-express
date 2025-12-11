'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        // Fetch all IG business accounts
        const accounts = await queryInterface.sequelize.query(
            `SELECT id FROM igb_accounts ORDER BY id ASC;`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const results = [];

        for (const acc of accounts) {

            // Fetch posts for account
            const posts = await queryInterface.sequelize.query(
                `SELECT id FROM ig_posts WHERE igb_account_id = :accId ORDER BY id ASC`,
                {
                    replacements: { accId: acc.id },
                    type: queryInterface.sequelize.QueryTypes.SELECT
                }
            );

            // If no posts exist → produce lightweight placeholder profile
            if (!posts.length) {
                const followers = 1500 + Math.floor(Math.random() * 4000); // 1.5k–5.5k

                results.push({
                    igb_account_id: acc.id,
                    followers_count: followers,
                    engagement: Number((0.4 + Math.random() * 0.8).toFixed(4)), // 0.40%–1.20%
                    views: 0,
                    likes: 0,
                    comments: 0,
                    saves: 0,
                    reach: 0,
                    posts: 0,
                });

                continue;
            }

            const postIds = posts.map(p => p.id);

            // Collect all story metrics belonging to this account (optional realism)
            const storyMetrics = await queryInterface.sequelize.query(
                `
                SELECT ism.views, ism.reach
                FROM ig_story_insight_metrics ism
                JOIN ig_stories s ON s.id = ism.ig_story_id
                WHERE s.igb_account_id = :accId
                `,
                {
                    replacements: { accId: acc.id },
                    type: queryInterface.sequelize.QueryTypes.SELECT
                }
            );

            // Fetch all post insight metrics
            const metrics = await queryInterface.sequelize.query(
                `
                SELECT 
                    views, likes, comments, saved AS saves, reach, engagement
                FROM ig_post_insight_metrics
                WHERE ig_post_id IN (:ids)
                `,
                {
                    replacements: { ids: postIds },
                    type: queryInterface.sequelize.QueryTypes.SELECT
                }
            );

            const totalPosts = metrics.length;

            const sum = (k) => metrics.reduce((s, m) => s + Number(m[k] || 0), 0);

            // Averages
            const avgViews = Math.round(sum('views') / totalPosts);
            const avgLikes = Math.round(sum('likes') / totalPosts);
            const avgComments = Math.round(sum('comments') / totalPosts);
            const avgSaves = Math.round(sum('saves') / totalPosts);
            const avgReach = Math.round(sum('reach') / totalPosts);

            const avgEngagement = Number(
                (metrics.reduce((s, m) => s + Number(m.engagement || 0), 0) / totalPosts).toFixed(4)
            );

            // Followers estimation based on:
            // - reach-to-follower ratio usually 10–30%
            // - engagement helps determine profile behavior
            const reachToFollowersRatio = 0.10 + Math.random() * 0.20; // 10%–30%

            const estimatedFollowers = Math.max(
                Math.round(avgReach / reachToFollowersRatio),
                1000 + Math.floor(Math.random() * 2000) // fallback
            );

            results.push({
                igb_account_id: acc.id,
                followers_count: estimatedFollowers,
                engagement: avgEngagement,
                views: avgViews,
                likes: avgLikes,
                comments: avgComments,
                saves: avgSaves,
                reach: avgReach,
                posts: totalPosts,
            });
        }

        // Reset table
        await queryInterface.sequelize.query(
            'TRUNCATE ig_profile_average_insights RESTART IDENTITY CASCADE;'
        );


        console.log(results);
        // Insert results
        await queryInterface.bulkInsert('ig_profile_average_insights', results, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('ig_profile_average_insights', null, {});
    }
};
