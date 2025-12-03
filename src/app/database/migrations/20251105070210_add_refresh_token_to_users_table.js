
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'refresh_token', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn('users', 'access_token');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'refresh_token');
    await queryInterface.addColumn('users', 'access_token', {
        type: Sequelize.STRING,
        allowNull: true,
    });
  },
};
