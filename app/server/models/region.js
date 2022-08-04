const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class region extends Model {
      static associate(models) {
      };
    }
    region.init({
      region_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      region_name: DataTypes.STRING,
      region_slug : DataTypes.STRING,
      lat : {
        type : DataTypes.REAL,
        defaultValue : 36.4389
      },
      lng :{
         type : DataTypes.REAL,
         defaultValue : 3.3782
      },
      radius : {
        type : DataTypes.REAL,
        defaultValue : 0
      },
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return region;
  };