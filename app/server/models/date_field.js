const {
    Model
  } = require('sequelize');
  
  module.exports = (sequelize, DataTypes) => {
    class date_field extends Model {
      static associate(models) {
      };
    }
    date_field.init({
        data_field_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      field_value :  {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
        }
    }, {
        sequelize,
        timestamps: true
      });
    
  
  
    return date_field;
  };