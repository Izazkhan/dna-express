'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const eRanges = [
            {
                label: "Any",
                order: 1,
                lower: 0,
                upper: 100
            },
            {
                label: ".5% - 1.5%",
                order: 2,
                lower: 0.5,
                upper: 1.5
            },
            {
                label: "1.5% - 3.5%",
                order: 3,
                lower: 1.5,
                upper: 3.5
            },
            {
                label: "3.5% - 6%",
                order: 4,
                lower: 3.5,
                upper: 6
            },
            {
                label: "6% - 8%",
                order: 5,
                lower: 6,
                upper: 8
            },
            {
                label: "8%+",
                order: 6,
                lower: 8,
                upper: 100
            }
        ];
        // Just to clear the old data
        await queryInterface.sequelize.query('TRUNCATE ad_campaign_engagement_ranges RESTART IDENTITY CASCADE;');
        await queryInterface.bulkInsert('ad_campaign_engagement_ranges', eRanges, {});
    }
};
