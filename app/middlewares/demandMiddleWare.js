

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
const Service  =  db.service
const ClientDemand =  db.client_demand
const DemandOffer = db.demand_offer
const Duration =  db.duration





/*hanlde files refrencing*/ 

exports.handledemandsFiles  = catchAsync(async(req , res , next)=>{
    const host = process.env.HOST;
    const client_demand =  req.inst.client_demand
    let {deleted_files} = req.body
    deleted_files =  deleted_files 
    // && JSON.parse(deleted_files);


    console.log("we are here  refrence files ");
 
    req.inst = {...req.inst , photo : null}
    if(req.files  && req.files["file"]){

        await Promise.all(req.files["file"].map( async fileObj=>{
       
            const url = host + "images/demands/" + fileObj.filename
            const type = fileObj.mimetype
            const pic =  await client_demand.createFile({ url, type  , name: "demand"})
           
        }))
    }

    deleted_files && await Promise.all(deleted_files.map(async id=>{
        await client_demand.removeFile(id)
    }))

    next()
})



exports.handleoffersfiles  = catchAsync(async(req , res , next)=>{
    const host = process.env.HOST;
    const demand_offer =  req.inst.demand_offer
    let {deleted_files} = req.body
    deleted_files =  deleted_files 
    // && JSON.parse(deleted_files);
 
    req.inst = {...req.inst , photo : null}
    if(req.files  && req.files["file"]){

        await Promise.all(req.files["file"].map( async fileObj=>{
       
            const url = host + "images/offers/" + fileObj.filename
            const type = fileObj.mimetype
            const pic =  await demand_offer.createFile({ url, type  , name: "offer"})
           
        }))
    }

    deleted_files && await Promise.all(deleted_files.map(async id=>{
        await demand_offer.removeFile(id)
    }))


    next()
})


/*hanle initiate */



exports.initiateAccountDemand  =  catchAsync(async(req , res ,  next)=>{
    const user =  req.inst.user;   
    const {client_demand_id} = req.query
    const { client_demand_title , client_demand_description , client_demand_budget ,
        client_demand_owner , client_demand_phone_number , client_demand_email ,
        client_demand_origin , client_demand_slug , client_demand_inscription_number,
        demand_beginAt , demand_endAt , client_demand_type
    } = req.body 
    
    let data  =  { client_demand_title , client_demand_description , client_demand_budget ,
        client_demand_owner , client_demand_phone_number , client_demand_email ,
        client_demand_origin , client_demand_slug , client_demand_inscription_number,
        demand_beginAt , demand_endAt ,client_demand_type };
    Object.keys(data).forEach(key => data[key] === undefined ? delete data[key] : {});
    



    const isPost = req.method =="POST";
    let client_demand;
    if(isPost){
        client_demand =  await user.createClient_demand(
            data
        );
    }else{
        client_demand = await ClientDemand.findByPk(client_demand_id)
        client_demand.set(data)
        await client_demand.save()
    }
    
    
    req.inst  = {...req.inst , client_demand}
    next()
})

exports.initiateAccountOffer  =  catchAsync(async(req , res ,  next)=>{
    const user =  req.inst.user;   
    const {demand_offer_id , client_demand_id , account_id} = req.query
    const {  demand_offer_description , demand_offer_budget  } = req.body 

    
    
    let data  =  {  demand_offer_description , demand_offer_budget , account_id  };
    Object.keys(data).forEach(key => data[key] === undefined ? delete data[key] : {});
    
    const isPost = req.method =="POST";
    const isDelete = req.method =="DELETE";
    let demand_offer;
    if(isPost){
        const  client_demand = await ClientDemand.findByPk(client_demand_id)

        if(!client_demand){
            return(next(new AppError('no_client_demand_found ' , 404)))
        }
        demand_offer =  await client_demand.createDemand_offer(
            data
        );
        
        await client_demand.increment({number_offers : 1})
        
    }else{
        demand_offer = demand_offer_id && await DemandOffer.findByPk(demand_offer_id)
        if(!demand_offer){
            return (next(new AppError("no_demand_offer_found" , 404)))
        }

        

        if(isDelete){
            const  client_demand = await ClientDemand.findByPk(demand_offer.dataValues.demand_id)

            if(!client_demand){
                return(next(new AppError('no_client_demand_found ' , 404)))
            }
            await client_demand.increment({number_offers : -1})
        }




        demand_offer.set(data)
        await demand_offer.save()
    }
    
    
    req.inst  = {...req.inst , demand_offer}
    next()
})





/* */

exports.handleAddress  =   catchAsync(async(req , res ,  next)=>{
    const client_demand =  req.inst.client_demand
    const {wilaya_id} =  req.body  
    const wilaya  = wilaya_id && await Wilaya.findByPk(wilaya_id);
    if(wilaya_id && !wilaya){
        return next (new AppError("no_wilaya_found" , 404))
    }
    wilaya_id && await client_demand.setWilaya(wilaya_id);
    next()
})


exports.handleService  =   catchAsync(async(req , res ,  next)=>{
    const client_demand =  req.inst.client_demand
    const services =  req.body.added_services  
    const services_deleted =  req.body.services_deleted 

    services && await Promise.all(services.map(async service_id=>{
        console.log("service id is ", service_id)
        const service  = service_id && await Service.findByPk(service_id);
        if(!service){
            return next (new AppError("service_not_found" , 404))
        }
        await client_demand.addService(service_id);
    }))

    services_deleted && await Promise.all(services_deleted.map(async service_id=>{
        await client_demand.removeService(service_id);
    }))
    
    next()
})


/*handle duration */

exports.handleDuration  = catchAsync(async(req , res , next)=>{
    const client_demand =  req.inst.client_demand
    let duration = req.body.duration
    var duration_name , duration_value ; 
    if(duration){
        duration_name  = duration.duration_name
        duration_value  = duration.duration_value
    }
    console.log(duration)
   

   if(duration_name &&  duration_value ){
    console.log("duratioj is ", duration_name &&  duration_value)
        duration =  await Duration.findOne({where : {duration_name ,  duration_value}})
        if(!duration){
            await  client_demand.createDuration({duration_name ,  duration_value})
        } else{
            await  client_demand.setDuration(duration.dataValues.duration_id)
        }
    }
    
    next()
})

/*chaneg  params for searching demands */

exports.handleAccountServices = catchAsync(async(req , res ,  next)=>{
    const account =  req.inst.account;

    let services =  await account.getAccount_services();
    services =  services.map(service=>{
        return  service.dataValues.service_id
    })


    delete(req.query.account_id);


    req.query = {
        ...req.query , 
        service_id : JSON.stringify({
            "or" : services 
        })
    }



    next()


})

exports.handleUser = catchAsync(async(req , res ,  next)=>{
    const user =  req.inst.user;
    req.query = {
        ...req.query , 
        user_id : JSON.stringify({
            "eq" : user.dataValues.user_id
        })
    }
    next()
})


exports.handleAccount = catchAsync(async(req , res ,  next)=>{
    const user =  req.inst.user;
    const account_id =  req.query.account_id;
    let services = null;
    if(account_id){
        let account =  account_id && await Account.findByPk(account_id);
        delete (req.query.account_id)
        if(!account){
            return(next(new AppError("no_account_found" , 404)))
        }
        if(account.dataValues.user_id !== user.dataValues.user_id){
            return(next(new AppError("unauthorized" , 403)))
        }
    
       services = await  account.getAccount_services()
    
    
        services =  services.map(service=>{
            return service.dataValues.service_id
        })

        if(services.length == 0){
            services = null
        }
    
    }

    


    req.query = {
        ...req.query , 
        services 
    }

    
    next()
})







