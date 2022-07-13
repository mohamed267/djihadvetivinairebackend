const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class form extends Model {
      static associate(models) {
      };
    }
    form.init({
      form_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      farm_name: DataTypes.STRING,
      date :  {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return form; 
  };