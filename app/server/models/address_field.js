const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class address_field extends Model {
      static associate(models) {
      };
    }
    address_field.init({
      address_field_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      address : DataTypes.TEXT,
      lng : DataTypes.FLOAT,
      lat : DataTypes.FLOAT
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return address_field;
  };