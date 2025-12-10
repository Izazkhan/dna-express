'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const ageRanges = [
            { name: "13-17" },
            { name: "18-24" },
            { name: "25-34" },
            { name: "35-44" },
            { name: "55-64" },
            { name: "65+" }
        ];
        // Just to clear the old data
        await queryInterface.sequelize.query('TRUNCATE ad_campaign_age_ranges RESTART IDENTITY CASCADE;');
        await queryInterface.bulkInsert('ad_campaign_age_ranges', ageRanges, {});
    }
};
