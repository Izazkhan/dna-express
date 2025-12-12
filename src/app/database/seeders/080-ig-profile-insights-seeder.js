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
            // Generate realistic follower count

            // 50k-200k
            let followers_count = 50000 + Math.floor(Math.random() * 150000);

            // Following count (typically followers/10 to followers/3)
            const followingRatio = 3 + Math.random() * 7; // 3-10
            const follows_count = Math.floor(followers_count / followingRatio);

            // Media count (posts they've made over time)
            const media_count = 50 + Math.floor(Math.random() * 450); // 50-500 posts

            results.push({
                igb_account_id: acc.id,
                followers_count: followers_count,
                follows_count: follows_count,
                media_count: media_count,
            });
        }

        // Insert results (assuming table name is ig_profile_insights or similar)
        await queryInterface.bulkInsert('ig_profile_insights', results, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('ig_profile_insights', null, {});
    }
};