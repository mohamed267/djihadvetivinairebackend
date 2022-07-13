





const { Sequelize } = require('sequelize');
const ormConfig = require("../config/config.json")

const NODE_ENV = process.env.NODE_ENV;

const   {username ,password,database,host,dialect} =  ormConfig[NODE_ENV]
let sequelize = null;



try {
  sequelize = new Sequelize(
    database,username ,password ,
    {
      host,
      dialect
    }
  )
}catch(error){
  console.log(error)
}





const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//To test the database connection
try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

db.admin = require('./admin')(sequelize, Sequelize);
db.region = require('./region')(sequelize, Sequelize);
db.form = require('./form')(sequelize, Sequelize);
db.form_field = require('./form_field')(sequelize, Sequelize);
db.boolean_field = require('./boolean_field')(sequelize, Sequelize);
db.text_field = require('./text_field')(sequelize, Sequelize);
db.string_field = require('./string_field')(sequelize, Sequelize);
db.address_field = require('./address_field')(sequelize, Sequelize);
db.date_field = require('./date_field')(sequelize, Sequelize);
db.number_field = require('./number_field')(sequelize, Sequelize);
db.field_group = require('./field_group')(sequelize, Sequelize);
db.field_option = require('./field_option')(sequelize, Sequelize);

/*region*/
db.region.hasMany(db.form , {foreignKey :  "region_id"})

/*form */
db.form.belongsTo(db.region , {foreignKey :  "region_id"})
db.form.hasMany(db.boolean_field , {foreignKey :  "form_id"})
db.form.hasMany(db.string_field , {foreignKey :  "form_id"})
db.form.hasMany(db.text_field , {foreignKey :  "form_id"})
db.form.hasMany(db.number_field , {foreignKey :  "form_id"})
db.form.hasMany(db.date_field , {foreignKey :  "form_id"})
db.form.hasMany(db.address_field , {foreignKey :  "form_id"})

 

/*form fields  */
db.form_field.hasMany(db.boolean_field , {foreignKey :  "form_field_id"})
db.form_field.hasMany(db.string_field , {foreignKey :  "form_field_id"})
db.form_field.hasMany(db.text_field , {foreignKey :  "form_field_id"})
db.form_field.hasMany(db.address_field , {foreignKey :  "form_field_id"})
db.form_field.hasMany(db.number_field , {foreignKey :  "form_field_id"})
db.form_field.hasMany(db.date_field , {foreignKey :  "form_field_id"})
db.form_field.hasMany(db.field_option , {foreignKey :  "form_field_id"})
db.form_field.hasMany(db.field_group , {foreignKey :  "field_group_id"})



/* field group  */
db.field_group.hasMany(db.form_field , {foreignKey :  "field_group_id"})



/*boolean field */
db.boolean_field.belongsTo(db.form_field , {foreignKey :  "form_field_id"})
db.boolean_field.belongsTo(db.form , {foreignKey :  "form_id"})

/*string field  */
db.string_field.belongsTo(db.form_field , {foreignKey :  "form_field_id"})
db.string_field.belongsTo(db.form , {foreignKey :  "form_id"})

/*text field */
db.text_field.belongsTo(db.form_field , {foreignKey :  "form_field_id"})
db.text_field.belongsTo(db.form , {foreignKey :  "form_id"})

/*address field */
db.address_field.belongsTo(db.form_field , {foreignKey :  "form_field_id"})
db.address_field.belongsTo(db.form , {foreignKey :  "form_id"})

/*number field */
db.number_field.belongsTo(db.form_field , {foreignKey :  "form_field_id"})
db.number_field.belongsTo(db.form , {foreignKey :  "form_id"})

/*datefield */
db.date_field.belongsTo(db.form_field , {foreignKey :  "form_field_id"})
db.date_field.belongsTo(db.form , {foreignKey :  "form_id"})

/*field option */
db.field_option.belongsTo(db.form_field , {foreignKey :  "form_field_id"})





db.sequelize.sync(
  // { force: true }
)


module.exports = db;

