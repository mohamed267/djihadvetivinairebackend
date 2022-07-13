'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const datacat = [
      {
        name: "alger",
        createdAt: new Date(),
        updatedAt: new Date(),
      }


    ]
    return queryInterface.bulkInsert('wilayas', datacat, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
