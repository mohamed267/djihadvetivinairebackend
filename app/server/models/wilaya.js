const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class wilaya extends Model {
      static associate(models) {
      };
    }
    wilaya.init({
        wilaya_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      wilaya_name: DataTypes.STRING,
      wilaya_slug : {
        type : DataTypes.STRING,
        defaultValue :  "wilaya"
      },
      wilaya_number : DataTypes.INTEGER
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return wilaya;
  };