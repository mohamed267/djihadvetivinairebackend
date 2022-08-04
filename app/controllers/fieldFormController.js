/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
/*sequelize */
const { Op } = require("sequelize");

/*models */
const db = require("../server/models/index")
const Config=  db.config
const FieldGroub = db.field_group
const FormField = db.form_field
const FieldOption  = db.field_option
const DateField =  db.date_field
const BooleanField = db.boolean_field
const NumberField = db.number_field
const StringField = db.string_field
const TextField = db.text_field
const AddressField = db.address_field






/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')


/*api features */
const Apifeatures = require('../utils/apiFeatures')







exports.fetchFieldForm  = catchAsync(async(req , res , next)=>{
    let form_field =  req.inst.form_field
    form_field = await FormField.findByPk(form_field.dataValues.form_field_id  ,{
        include : [FieldGroub , FieldOption ,DateField , BooleanField , NumberField , StringField , TextField , AddressField]
    })
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `field_forms_modified_succefully`,
        data : form_field
    })
    
})







exports.deleteFieldForm  = catchAsync(async(req , res , next)=>{
    const features = new Apifeatures(req.query).filter().queryObj
    await FormField.destroy({...features})
    

    // client_demand = await ClientDemend.destroy({where :  {client_demand_id}})

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `field_forms_deleted_succefully`
    })
    
})


exports.getFieldForms = catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj

    const field_forms = await FormField.findAll({...features ,  include : 
        [FieldGroub , FieldOption ,DateField , BooleanField , NumberField , StringField , TextField , AddressField]})
    
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `field_forms`,
        data:  field_forms
    })
})


exports.getFieldForm = catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj

    const field_form = await FormField.findOne({...features ,  include : [FieldGroub , FieldOption,DateField , BooleanField , NumberField , StringField , TextField , AddressField]})
    
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `field_forms`,
        data:  field_form
    })
})




