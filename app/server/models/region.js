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
      long_size : {
        type : DataTypes.REAL,
        defaultValue : 0
      },
      lat_size : {
        type : DataTypes.REAL,
        defaultValue : 0
      },
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return region;
  };