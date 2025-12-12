'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Fetch all IG business accounts with their profile data
        const profiles = await queryInterface.sequelize.query(
            `SELECT igb_account_id, followers_count 
             FROM ig_profile_insights 
             ORDER BY igb_account_id ASC;`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const results = [];

        for (const profile of profiles) {
            const { igb_account_id, followers_count } = profile;

            // Fetch post metrics for this account
            const postMetrics = await queryInterface.sequelize.query(
                `
                SELECT ipm.views, ipm.likes, ipm.comments, ipm.saved AS saves, 
                       ipm.reach, ipm.engagement
                FROM ig_post_insight_metrics ipm
                JOIN ig_posts ip ON ip.id = ipm.ig_post_id
                WHERE ip.igb_account_id = :accId
                `,
                {
                    replacements: { accId: igb_account_id },
                    type: queryInterface.sequelize.QueryTypes.SELECT
                }
            );

            // Fetch story metrics for this account
            const storyMetrics = await queryInterface.sequelize.query(
                `
                SELECT ism.views, ism.reach
                FROM ig_story_insight_metrics ism
                JOIN ig_stories s ON s.id = ism.ig_story_id
                WHERE s.igb_account_id = :accId
                `,
                {
                    replacements: { accId: igb_account_id },
                    type: queryInterface.sequelize.QueryTypes.SELECT
                }
            );

            // If no metrics exist, create placeholder based on follower count
            if (!postMetrics.length && !storyMetrics.length) {
                // Generate realistic engagement rate based on follower count
                let engagementRate;
                if (followers_count < 10000) {
                    engagementRate = 0.03 + Math.random() * 0.05; // 3-8%
                } else if (followers_count < 50000) {
                    engagementRate = 0.02 + Math.random() * 0.03; // 2-5%
                } else if (followers_count < 200000) {
                    engagementRate = 0.01 + Math.random() * 0.02; // 1-3%
                } else {
                    engagementRate = 0.005 + Math.random() * 0.015; // 0.5-2%
                }

                const reachRate = 0.10 + Math.random() * 0.30; // 10-40%
                const reach = Math.round(followers_count * reachRate);
                const views = Math.round(reach * (0.7 + Math.random() * 0.3));

                const totalEngagements = Math.round(followers_count * engagementRate);
                const likes = Math.round(totalEngagements * 0.70);
                const comments = Math.round(totalEngagements * 0.20);
                const saves = Math.round(totalEngagements * 0.10);

                results.push({
                    igb_account_id: igb_account_id,
                    followers_count: followers_count,
                    engagement: Number(engagementRate.toFixed(4)),
                    views: views,
                    likes: likes,
                    comments: comments,
                    saves: saves,
                    reach: reach,
                    posts: 0,
                });

                continue;
            }

            // Calculate averages from actual data
            const sum = (arr, key) => arr.reduce((s, m) => s + Number(m[key] || 0), 0);

            let avgViews = 0;
            let avgLikes = 0;
            let avgComments = 0;
            let avgSaves = 0;
            let avgReach = 0;
            let avgEngagement = 0;

            const totalPosts = postMetrics.length;

            if (totalPosts > 0) {
                avgViews = Math.round(sum(postMetrics, 'views') / totalPosts);
                avgLikes = Math.round(sum(postMetrics, 'likes') / totalPosts);
                avgComments = Math.round(sum(postMetrics, 'comments') / totalPosts);
                avgSaves = Math.round(sum(postMetrics, 'saves') / totalPosts);
                avgReach = Math.round(sum(postMetrics, 'reach') / totalPosts);
                avgEngagement = Number((sum(postMetrics, 'engagement') / totalPosts).toFixed(4));
            }

            // Blend in story data (70% posts, 30% stories)
            if (storyMetrics.length > 0) {
                const storyAvgViews = Math.round(sum(storyMetrics, 'views') / storyMetrics.length);
                const storyAvgReach = Math.round(sum(storyMetrics, 'reach') / storyMetrics.length);

                if (totalPosts > 0) {
                    avgViews = Math.round(avgViews * 0.7 + storyAvgViews * 0.3);
                    avgReach = Math.round(avgReach * 0.7 + storyAvgReach * 0.3);
                } else {
                    avgViews = storyAvgViews;
                    avgReach = storyAvgReach;
                }
            }

            results.push({
                igb_account_id: igb_account_id,
                engagement: avgEngagement,
                views: avgViews,
                followers_count: followers_count,
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

        console.log(`Calculated average insights for ${results.length} profiles`);

        // Insert results
        await queryInterface.bulkInsert('ig_profile_average_insights', results, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('ig_profile_average_insights', null, {});
    }
};