

/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const { singleUpload } = require('../controllers/uploadController')
/*models */
const db = require("../server/models/index")
const Files = db.file
const AccountDemand = db.client_demand;
const Account = db.account
const Wilaya  =  db.wilaya
const Event=  db.event
const Service  =  db.service
const ClientDemand =  db.client_demand
const DemandOffer = db.demand_offer
const Duration =  db.duration



exports.initTransaction = catchAsync(async(req , res , next)=>{
    const  t  = await  db.sequelize.transaction();
    req.inst = {...req.inst  , t }
    next()
})



/*hanlde files refrencing*/ 




exports.handleEventfiles  = catchAsync(async(req , res , next)=>{
    const host = process.env.HOST;
    const t =  req.inst.t
    const event =  req.inst.event
    let {deleted_files} = req.body
    deleted_files =  deleted_files 
    // && JSON.parse(deleted_files);
 
    req.inst = {...req.inst , photo : null}
    if(req.files  && req.files["file"]){

        await Promise.all(req.files["file"].map( async fileObj=>{
       
            const url = host + "images/events/" + fileObj.filename
           
            const type = fileObj.mimetype
            await event.createFile({ url, type  , name: "event"} ,  {
                    transaction : t
                })
        }))
    }

    deleted_files && await Promise.all(deleted_files.map(async id=>{
        await event.removeFile(id ,  {
            transaction : t
        })
    }))

    next()
})


/*hanle initiate */



exports.initiateEvent  =  catchAsync(async(req , res ,  next)=>{
    const user =  req.inst.user;   
    const t =  req.inst.t
    const {event_id} = req.query
    const { event_name , event_slug , event_description_slug , event_description,
        event_time
    } = req.body 
    
    let data  =  { event_name , event_slug , event_description_slug , event_description,
        event_time };
    Object.keys(data).forEach(key => data[key] === undefined ? delete data[key] : {});
    



    const isPost = req.method =="POST";
    let event;
    if(isPost){
        event =  await user.createEvent(
            data ,  {
                transaction : t
            }
        );
    }else{
        event = await Event.findByPk(event_id)
        if(!event){
            return next(new AppError("no_event_found" , 404))
        }
        event.set(data)
        await event.save( {
            transaction : t
        })
    }
    
    
    req.inst  = {...req.inst , event}
    next()
})











/* */

exports.handleAddress  =   catchAsync(async(req , res ,  next)=>{
    const event =  req.inst.event
    const t =  req.inst.t
    const {wilaya_id} =  req.body.address
    const wilaya  = wilaya_id && await Wilaya.findByPk(wilaya_id);
    if(wilaya_id && !wilaya){
        return next (new AppError("no_wilaya_found" , 404))
    }


    req.body.address  && await event.createAddress(req.body.address , {transaction : t});

    

    next()
})


