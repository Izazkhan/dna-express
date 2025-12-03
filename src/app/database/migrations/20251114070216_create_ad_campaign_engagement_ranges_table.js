'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ad_campaign_engagement_ranges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lower: {
        type: Sequelize.FLOAT
      },
      upper: {
        type: Sequelize.FLOAT
      },
      order: {
        type: Sequelize.INTEGER
      },
      label: {
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ad_campaign_engagement_ranges');
  }
};