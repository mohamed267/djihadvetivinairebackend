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
const ClientDemend =  db.client_demand
const Wilaya = db.wilaya
const DemandOffer = db.demand_offer
const Account  =  db.account
const ClientDemand = db.client_demand
const Duration =  db.duration


/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')


/*api features */
const Apifeatures = require('../utils/apiFeatures')





exports.createDemand  = catchAsync(async(req , res , next)=>{
    let  { client_demand } = req.inst

    client_demand = await ClientDemend.findByPk(
        client_demand.dataValues.client_demand_id , {
            include : [
                {model : Service},
                {model : Files},
                {model : Wilaya},
                {model : Duration}
            ]
        }
    )

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `demand_created_succefully`,
        data : client_demand
    })
    
})


exports.updateDemand  = catchAsync(async(req , res , next)=>{
    console.log("demand is updating")

    let  {client_demand } = req.inst

    client_demand = await ClientDemend.findByPk(
        client_demand.dataValues.client_demand_id , {
            include : [
                {model : Service},
                {model : Files},
                {model : Wilaya},
                {model : Duration}
            ]
        }
    )

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `demand_updated_succefully`,
        data : client_demand
    })
    
})


exports.deleteDemand  = catchAsync(async(req , res , next)=>{
    let  {client_demand_id } = req.query
    const user =  req.inst.user
    await user.removeClient_demand(client_demand_id)

    // client_demand = await ClientDemend.destroy({where :  {client_demand_id}})

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `demand_deleted_succefully`
    })
    
})




exports.getClientDemands =  catchAsync(async(req, res , next)=>{
    const user =  req.inst.user
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj


    let services  = req.query.services ? {
        required: true,
        through: {
            where: {
                service_id: {
                    [Op.or] : req.query.services 
                }
            }
        }
    }:{}


    const { count, rows } = await ClientDemend.findAndCountAll(
        { ...features ,
            where : {
                ...features.where 
            },
            include : [
                {
                    model : Service,
                    ...services
                
                },
                {model : Files},
                {model : Wilaya},
                {model : Duration}
            ]

        }
    )
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `demands`,
        data: {
            count,
            demands: rows
        }
    })
})


exports.filterClientDemands =  catchAsync(async(req, res , next)=>{
    // const user =  req.inst.user
    let services  = req.query.demand_services ? {
        required: true,
        through: {
            where: {
                service_id: {
                    [Op.or] : req.query.demand_services 
                }
            }
        }
    }:{}

    delete req.query.demand_services;
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    
   


    const { count, rows } = await ClientDemend.findAndCountAll(
        { ...features ,
            include : [
                {
                    model : Service,
                    ...services
                
                },
                {model : Files},
                {model : Wilaya},
                {model : Duration}
            ]

        }
    )
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `demands`,
        data: {
            count,
            demands: rows
        }
    })
})

/*offers */ 



exports.createOffer  = catchAsync(async(req , res , next)=>{
    let   demand_offer  = req.inst.demand_offer

    demand_offer = await DemandOffer.findByPk(
        demand_offer.dataValues.demand_offer_id , {
            include : [
                {model : Files},
                {model : Account},
                {model : ClientDemand}
                
            ]
        }
    )


    tokenInterceptor(req, res, next, {
        status: "success",
        message: `offer_created_succefully`,
        data : demand_offer
    })
    
})


exports.updateOffer = catchAsync(async(req , res , next)=>{
    let   demand_offer  = req.inst.demand_offer
    demand_offer = await DemandOffer.findByPk(
        demand_offer.dataValues.demand_offer_id , {
            include : [
                {model : Files},
                {model : Account},
                {model : ClientDemand}
                
            ]
        }
    )


    tokenInterceptor(req, res, next, {
        status: "success",
        message: `offer_updated_succefully`,
        data : demand_offer
    })
    
})


exports.deleteOffer = catchAsync(async(req , res , next)=>{
    let   demand_offer  = req.inst.demand_offer
    await demand_offer.destroy()


    tokenInterceptor(req, res, next, {
        status: "success",
        message: `offer_deleted_succefully`,
    })
    
})
