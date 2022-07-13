const {
  Model
} = require('sequelize');
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    static associate(models) {
    };
    static async correctPassword(
      candidatPassword,
      adminPassword
    ) {
      return (await bcrypt.compare(candidatPassword, adminPassword));
    };
  }
  admin.init({
    admin_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uid : {
      type : DataTypes.STRING,
      defaultValue : ""
    },
    admin_subscriped : {
      type : DataTypes.BOOLEAN,
      defaultValue : false
    },
    admin_display_name: DataTypes.STRING,
    admin_password: DataTypes.STRING,
    admin_username : DataTypes.STRING,
    admin_confirmed: {
      type: DataTypes.BOOLEAN
    },
    admin_suspended: {
      type: DataTypes.BOOLEAN
    },
    admin_verified: {
      type: DataTypes.BOOLEAN
    }
  }, {
      sequelize,
      timestamps: true
    });
    admin.beforeCreate(async (admin, options) => {
    admin.admin_password = await bcrypt.hash(admin.admin_password, 12);
  });

  admin.beforeUpdate(async (admin, options) => {
    admin.admin_password = await bcrypt.hash(admin.admin_password, 12);
  });



  admin.beforeBulkUpdate(async (admin, options) => {
    if (admin.attributes.admin_password) {
      admin.attributes.admin_password = await bcrypt.hash(admin.attributes.admin_password, 12);
    }
  });


  return admin;
};