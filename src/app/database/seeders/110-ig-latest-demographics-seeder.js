'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        // 1) Get all IG accounts along with followers_count count from profile insights
        const accounts = await queryInterface.sequelize.query(
            `
            SELECT a.id AS igb_account_id, pi.followers_count
            FROM igb_accounts a
            LEFT JOIN ig_profile_insights pi ON pi.igb_account_id = a.id
            ORDER BY a.id ASC
            `,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const results = [];

        for (const acc of accounts) {

            const followers_count = acc.followers_count; // fallback if null

            // --- GENDER SPLIT (percentages) ---
            const malePct = Math.random() * 60;                  // 0–60%
            const femalePct = Math.random() * (100 - malePct);  // remaining
            const unspecifiedPct = 100 - (malePct + femalePct);

            // Convert to counts
            const maleCount = Math.round(followers_count * malePct / 100);
            const femaleCount = Math.round(followers_count * femalePct / 100);

            // --- BINARY GENDER (relative to specified) ---
            const binarySum = maleCount + femaleCount;
            const percent_male_binary = Number((maleCount / binarySum * 100).toFixed(2));
            const percent_female_binary = Number((femaleCount / binarySum * 100).toFixed(2));
            const binary_total = maleCount + femaleCount;

            // --- AGE GROUPS (percentages of total followers_count) ---
            let a13_17 = Math.random() * 0.10 * followers_count;
            let a18_24 = Math.random() * 0.25 * followers_count;
            let a25_34 = Math.random() * 0.35 * followers_count;
            let a35_44 = Math.random() * 0.20 * followers_count;
            let a45_54 = Math.random() * 0.10 * followers_count;
            let sumAges = a13_17 + a18_24 + a25_34 + a35_44 + a45_54;
            let a55_up = Math.max(followers_count - sumAges, 0);

            // Convert to percentages
            const percent_13_17 = Number((a13_17 / followers_count * 100).toFixed(2));
            const percent_18_24 = Number((a18_24 / followers_count * 100).toFixed(2));
            const percent_25_34 = Number((a25_34 / followers_count * 100).toFixed(2));
            const percent_35_44 = Number((a35_44 / followers_count * 100).toFixed(2));
            const percent_45_54 = Number((a45_54 / followers_count * 100).toFixed(2));
            const percent_55_up = Number((a55_up / followers_count * 100).toFixed(2));

            results.push({
                igb_account_id: acc.igb_account_id,
                percent_female: femalePct.toFixed(2),
                percent_male: malePct.toFixed(2),
                percent_unspecified: unspecifiedPct.toFixed(2),
                percent_13_17,
                percent_18_24,
                percent_25_34,
                percent_35_44,
                percent_45_54,
                percent_55_up,
                percent_male_binary,
                percent_female_binary,
                followers_count,
                binary_total,
                created_at: new Date(),
                updated_at: new Date()
            });
        }

        // Reset table
        await queryInterface.sequelize.query(
            'TRUNCATE ig_latest_demographic_insights RESTART IDENTITY CASCADE;'
        );

        await queryInterface.bulkInsert('ig_latest_demographic_insights', results, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('ig_latest_demographic_insights', null, {});
    }
};
