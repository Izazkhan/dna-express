'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS ad_campaign_demographic_age_ranges (
        ad_campaign_demographic_id  integer REFERENCES ad_campaign_demographics (id),
        age_range_id  integer REFERENCES ad_campaign_age_ranges (id)
      )
    `);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ad_campaign_demographic_age_ranges');
  }
};