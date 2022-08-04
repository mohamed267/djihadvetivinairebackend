const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class daira extends Model {
      static associate(models) {
      };
    }
    daira.init({
        daira_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      daira_name: DataTypes.STRING,
      daira_slug : {
        type : DataTypes.STRING,
        defaultValue :  "wilaya"
      },
      daira_number : DataTypes.INTEGER
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return daira;
  };