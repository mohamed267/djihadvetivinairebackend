/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
/*sequelize */
const { Op } = require("sequelize");

/*models */
const db = require("../server/models/index")
const Files = db.file
const Config=  db.config
const ClientDemend =  db.client_demand
const Wilaya = db.wilaya
const Duration =  db.duration
const Ads =  db.ad



/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')


/*api features */
const Apifeatures = require('../utils/apiFeatures')





exports.returnConfigs  = catchAsync(async(req , res , next)=>{
    const t=  req.inst.t
    let configs = req.inst.configs
    t.commit()

    configs =   await( Promise.all(configs.map(async config_id=>{
        return await Config.findByPk(config_id);
    })))
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `configs_modified_succefully`,
        data : configs
    })
    
})







exports.deleteConfig  = catchAsync(async(req , res , next)=>{
    const features = new Apifeatures(req.query).filter().queryObj
    await Config.destroy({...features})

    // client_demand = await ClientDemend.destroy({where :  {client_demand_id}})

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `configs_deleted_succefully`
    })
    
})


exports.getConfigs = catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().queryObj

    const {rows , count} = await Config.findAndCountAll({...features})
    
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `configs`,
        data:   rows
    })
})




