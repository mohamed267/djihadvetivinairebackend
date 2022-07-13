'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const datacat = [
      {
        experty_type: "job",
        experty_slug : "job",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        experty_type: "education",
        experty_slug : "education",
        createdAt: new Date(),
        updatedAt: new Date(),
      }


    ]
    return queryInterface.bulkInsert('experties', datacat, {});
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
