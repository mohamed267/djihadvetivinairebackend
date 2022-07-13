const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class field_option extends Model {
      static associate(models) {
      };
    }
    field_option.init({
        field_option_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      field_option_value : DataTypes.STRING
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return field_option;
  };