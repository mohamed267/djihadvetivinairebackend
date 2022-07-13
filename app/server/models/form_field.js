const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class form_field extends Model {
      static associate(models) {
      };
    }
    form_field.init({
      form_field_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      form_field_name: DataTypes.STRING,
      form_field_type :  DataTypes.STRING,
      form_field_search :  {
        type : DataTypes.BOOLEAN,
        defaultValue :  false
      }
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return form_field;
  };