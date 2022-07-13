/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
/*sequelize */
const { Op } = require("sequelize");

/*models */
const db = require("../server/models/index")
const Ad = db.ad
const Files = db.file
const Service=  db.service
const Restriction = db.restriction


/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')


/*api features */
const Apifeatures = require('../utils/apiFeatures');


exports.getServices  = catchAsync( async(req , res , next)=>{
    // console.log(req.query)
    // res.status(200).send(req.query)
    console.log("query is ", req.query , req.params)

    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await Service.findAndCountAll({
        ...features,
        include: [
            {model : Files} , 
            {model : Service} , 
            {model : Restriction}
        ]
    }
    )
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `services`,
        data: {
            count,
            services: rows
        }
    })  
})


exports.getService  = catchAsync( async(req , res , next)=>{
    // console.log(req.query)
    // res.status(200).send(req.query)

    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const service = await Service.findOne({
        ...features,
        include: [
            {model : Files} , 
            {model : Service , 
                include : [
                    {model : Files} , 
                    {model : Service } , 
                    {model : Restriction}
                ] 
            } , 
            {model : Restriction}
        ]
    }
    )
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `service`,
        data: service ? service : {}
    })  
})


exports.createService  = catchAsync(async(req , res , next)=>{
    const  t =  req.inst.t;
    let service  =  req.inst .service
    t.commit();
    service = await Service.findByPk(
        service.dataValues.service_id,
        { 
           include : [
            {model  :  Files },
            {model : Restriction}
           ]
        })

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `service_created_succefully`,
        data: service
    })
})


exports.updateService  = catchAsync( async(req , res , next)=>{
    const  t =  req.inst.t;
    let service  =  req.inst .service
    t.commit();
    service = await Service.findByPk(
        service.dataValues.service_id,
        { 
           include : [
            {model  :  Files },
            {model : Restriction}
           ]
        })

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `service_updated_succefully`,
        data : service
    })
    
})






exports.deleteService  = catchAsync( async(req , res , next)=>{
    let { service_id } = { ...req.params, ...req.query }
    let service = await Service.findByPk(service_id)
    if(!service){
        return next(new AppError("no_service_found",404))
    }

    await service.destroy()

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `service_deleted_succefully`
    })
    
})


