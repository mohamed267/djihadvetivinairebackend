const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class number_field extends Model {
      static associate(models) {
      };
    }
    number_field.init({
      text_field_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      field_value : DataTypes.REAL
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return number_field;
  };