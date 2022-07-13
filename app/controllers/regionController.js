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







exports.fetchRegion  = catchAsync(async(req , res , next)=>{
    let region =  req.inst.region
    region = await Region.findByPk(region.dataValues.region_id)
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `region_modified_succefully`,
        data : region
    })
    
})







exports.deleteRegion  = catchAsync(async(req , res , next)=>{
    const features = new Apifeatures(req.query).filter().queryObj
    await Region.destroy({...features})

    // client_demand = await ClientDemend.destroy({where :  {client_demand_id}})

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `regions_deleted_succefully`
    })
    
})


exports.getRegions = catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj

    const {rows , count} = await Region.findAndCountAll({...features})
    
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `regions`,
        data:  {
            count,
            regions : rows
        } 
    })
})




