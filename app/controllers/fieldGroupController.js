/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
/*sequelize */
const { Op } = require("sequelize");

/*models */
const db = require("../server/models/index")
const Config=  db.config
const FieldGroup = db.field_group
const FieldOption  = db.field_option



/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')


/*api features */
const Apifeatures = require('../utils/apiFeatures')







exports.fetchFieldGroup  = catchAsync(async(req , res , next)=>{
    let field_group =  req.inst.field_group
    field_group = await FieldGroup.findByPk(field_group.dataValues.field_group_id  )
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `field_groups_modified_succefully`,
        data : field_group
    })
    
})







exports.deleteFieldGroup  = catchAsync(async(req , res , next)=>{
    const features = new Apifeatures(req.query).filter().queryObj
    await FieldGroup.destroy({...features})
    

    // client_demand = await ClientDemend.destroy({where :  {client_demand_id}})

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `field_groups_deleted_succefully`
    })
    
})


exports.getFieldGroups = catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj

    const field_groups = await FieldGroup.findAll({...features})
    
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `field_groups`,
        data:  field_groups
    })
})


exports.getFieldGroup = catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj

    const field_group = await FieldGroup.findOne({...features })
    
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `field_groups`,
        data:  field_group
    })
})




