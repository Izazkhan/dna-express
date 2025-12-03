'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const deliverables = [
      {
        name: "Reels",
        slug: "reels",
        is_active: true,
      }, {
        name: "Post",
        slug: "post",
        is_active: true
      }
    ];
    // Just to clear the old data
    await queryInterface.sequelize.query('TRUNCATE ad_campaign_deliverables RESTART IDENTITY CASCADE;');
    await queryInterface.bulkInsert('ad_campaign_deliverables', deliverables, {});
  }
};
