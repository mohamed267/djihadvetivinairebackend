const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class boolean_field extends Model {
      static associate(models) {
      };
    }
    boolean_field.init({
      boolean_field_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      field_value : DataTypes.BOOLEAN
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return boolean_field;
  };