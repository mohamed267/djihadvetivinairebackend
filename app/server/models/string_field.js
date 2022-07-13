const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class string_field extends Model {
      static associate(models) {
      };
    }
    string_field.init({
        string_field_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      field_value : DataTypes.STRING
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return string_field;
  };