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
const Event = db.event
const Address =  db.address


/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')


/*api features */
const Apifeatures = require('../utils/apiFeatures')












exports.filterEvents =  catchAsync(async(req, res , next)=>{

    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    
   


    const { count, rows } = await Event.findAndCountAll(
        { ...features ,
            include : [
                {model : Files},
                {model : Address}
            ]

        }
    )
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `events`,
        data: {
            count,
            events: rows
        }
    })
})

/*offers */ 



exports.createEvent  = catchAsync(async(req , res , next)=>{
    let   event  = req.inst.event
    const t =  req.inst.t 
    
    t.commit();

    event = await Event.findByPk(
        event.dataValues.event_id , {
            include : [
                {model : Files},
                {model : Address}
                
            ]
        }
    )


    tokenInterceptor(req, res, next, {
        status: "success",
        message: `event_created_succefully`,
        data : event
    })
    
})

exports.updateEvent  = catchAsync(async(req , res , next)=>{
    let   event  = req.inst.event
    const t =  req.inst.t 
    
    t.commit();


    event = await Event.findByPk(
        event.dataValues.event_id , {
            include : [
                {model : Files},
                {model : Address}
                
            ]
        }
    )

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `event_updated_succefully`,
        data : event
    })
    
})




exports.deleteEvent = catchAsync(async(req , res , next)=>{
    let   event  = req.inst.event
    await event.destroy()


    tokenInterceptor(req, res, next, {
        status: "success",
        message: `event_deleted_succefully`,
    })
    
})
