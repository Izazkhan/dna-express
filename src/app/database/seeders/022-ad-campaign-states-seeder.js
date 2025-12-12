'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const deliverables = [
      {
        name: "Matched",
        slug: "matched",
      }, {
        name: "Accepted",
        slug: "accepted",
      },{
        name: "Offered",
        slug: "offered",
      }, {
        name: "Contract",
        slug: "contract",
      },{
        name: "Briefed",
        slug: "briefed",
      }, {
        name: "Drafted",
        slug: "drafted",
      },{
        name: "Approved",
        slug: "approved",
      }, {
        name: "Published",
        slug: "published",
      },{
        name: "Completed",
        slug: "completed",
      }
    ];
    // Just to clear the old data
    await queryInterface.sequelize.query('TRUNCATE ad_campaign_states RESTART IDENTITY CASCADE;');
    await queryInterface.bulkInsert('ad_campaign_states', deliverables, {});
  }
};
