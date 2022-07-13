'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const datacat = [
      {
        service_name: "service 1",
        service_slug : "serice1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        service_name: "service 2",
        service_slug : "serice2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        service_name: "service 3",
        service_slug : "serice3",
        super_service_id : 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },


    ]
    return queryInterface.bulkInsert('services', datacat, {});
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
