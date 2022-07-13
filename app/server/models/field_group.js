const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class field_group extends Model {
      static associate(models) {
      };
    }
    field_group.init({
        field_group_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      field_group_name: DataTypes.STRING,
      field_group_slug :  DataTypes.STRING
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return field_group;
  };