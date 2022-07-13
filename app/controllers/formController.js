/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
/*sequelize */
const { Op } = require("sequelize");

/*models */
const db = require("../server/models/index")
const Config=  db.config
const Region = db.region
const FieldGroup = db.field_group
const FormField = db.form_field
const FieldOption  = db.field_option
const DateField =  db.date_field
const BooleanField = db.boolean_field
const NumberField = db.number_field
const StringField = db.string_field
const TextField = db.text_field
const AddressField = db.address_field
const Form  = db.form



/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')


/*api features */
const Apifeatures = require('../utils/apiFeatures')







exports.fetchForm  = catchAsync(async(req , res , next)=>{
    let form =  req.inst.form
    form = await Form.findByPk(form.dataValues.form_id  ,{
        include : [
            Region , 
            {
                model: BooleanField,
                include : [
                    {
                        model : FormField , 
                        include : [ FieldOption , FieldGroup]
                    }
                ]
            },
            {
                model: DateField,
                include : [
                    {
                        model : FormField , 
                        include : [ FieldOption , FieldGroup]
                    }
                ]
            },
            {
                model: NumberField,
                include : [
                    {
                        model : FormField , 
                        include : [ FieldOption , FieldGroup]
                    }
                ]
            },
            {
                model: StringField,
                include : [
                    {
                        model : FormField , 
                        include : [ FieldOption , FieldGroup]
                    }
                ]
            },
            {
                model: TextField,
                include : [
                    {
                        model : FormField , 
                        include : [ FieldOption , FieldGroup]
                    }
                ]
            },
            {
                model: AddressField,
                include : [
                    {
                        model : FormField , 
                        include : [ FieldOption , FieldGroup]
                    }
                ]
            }
        ]

    } )
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `form_modified_succefully`,
        data : form
    })
    
})







exports.deleteForm  = catchAsync(async(req , res , next)=>{
    const features = new Apifeatures(req.query).filter().queryObj
    await Form.destroy({...features})

    // client_demand = await ClientDemend.destroy({where :  {client_demand_id}})

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `forms_deleted_succefully`
    })
    
})


exports.getForms = catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj

    const {rows , count} = await Form.findAndCountAll({...features})
    
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `forms`,
        data:  {
            count,
            forms : rows
        } 
    })
})




