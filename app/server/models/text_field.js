const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class text_field extends Model {
      static associate(models) {
      };
    }
    text_field.init({
      text_field_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      field_value : DataTypes.TEXT
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return text_field;
  };