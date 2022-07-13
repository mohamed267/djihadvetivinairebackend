'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const datacat = [
      {
        account_type_name: "accout type 1",
        account_type_slug : "accounttype1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account_type_name: "accout type 2",
        account_type_slug : "accounttype2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account_type_name: "accout type 3",
        account_type_slug : "accounttype3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },


    ]
    return queryInterface.bulkInsert('account_types', datacat, {});
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
