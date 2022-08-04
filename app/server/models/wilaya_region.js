const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class wilaya_region extends Model {
      static associate(models) {
      };
    }
    wilaya_region.init({
        wilaya_region_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
     
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return wilaya_region;
  };