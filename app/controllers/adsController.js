/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
/*sequelize */
const { Op } = require("sequelize");

/*models */
const db = require("../server/models/index")
const Files = db.file
const Service=  db.service
const ClientDemend =  db.client_demand
const Wilaya = db.wilaya
const Duration =  db.duration
const Ads =  db.ad



/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')


/*api features */
const Apifeatures = require('../utils/apiFeatures')





exports.createAd  = catchAsync(async(req , res , next)=>{
    let   ad = req.inst.ad
    const t =  req.inst.t

    ad = await Ads.findByPk(
        ad.dataValues.ad_id , {
            include : [
                {model : Duration},
                {model : Files}
            ]
        }
    )
    t.commit()

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `ad_created_succefully`,
        data : ad
    })
    
})

exports.updateAd  = catchAsync(async(req , res , next)=>{
    let   ad = req.inst.ad
    const t =  req.inst.t
    t.commit()

    ad = await Ads.findByPk(
        ad.dataValues.ad_id , {
            include : [
                {model : Duration},
                {model : Files}
            ]
        }
    )

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `ad_updated_succefully`,
        data : ad
    })
    
})


exports.updateAd  = catchAsync(async(req , res , next)=>{
    let   ad = req.inst.ad
    const t =  req.inst.t
    t.commit()

    ad = await Ads.findByPk(
        ad.dataValues.ad_id , {
            include : [
                {model : Duration},
                {model : Files}
            ]
        }
    )

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `ad_updated_succefully`,
        data : ad
    })
    
})


exports.deleteAd  = catchAsync(async(req , res , next)=>{
    const ad =  req.inst.ad
    await ad.destroy()

    // client_demand = await ClientDemend.destroy({where :  {client_demand_id}})

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `ad_deleted_succefully`
    })
    
})


exports.getAd = catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    
    const ad = await Ads.findAndCountAll(
        { ...features ,
            
            include : [
                {model : Files},
                {model : Duration}
            ]

        }
    )
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `ad`,
        data: ad ? ad : {}
    })
})


exports.getAds =  catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    
    const { count, rows } = await Ads.findAndCountAll(
        { ...features ,
            where : {
                ...features.where 
            },
            include : [
                {model : Files},
                {model : Duration}
            ]

        }
    )
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `ads`,
        data: {
            count,
            ads: rows
        }
    })
})


