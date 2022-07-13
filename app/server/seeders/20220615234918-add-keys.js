'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const datacat = [
      {
        key_name: "key 1",
        key_slug : "key1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key_name: "key 2",
        key_slug : "key2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key_name: "key 3",
        key_slug : "key3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },


    ]
    return queryInterface.bulkInsert('keys', datacat, {});
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
