const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class commune extends Model {
      static associate(models) {
      };
    }
    commune.init({
        commune_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      commune_name: DataTypes.STRING,
      commune_slug : {
        type : DataTypes.STRING,
        defaultValue :  "wilaya"
      },
      commune_number : DataTypes.INTEGER
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return commune;
  };