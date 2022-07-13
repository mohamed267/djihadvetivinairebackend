

/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const { singleUpload } = require('../controllers/uploadController')
/*models */
const db = require("../server/models/index")
const { config } = require("dotenv")
const Config =  db.config



exports.initTransaction = catchAsync(async(req , res , next)=>{
    const  t  = await  db.sequelize.transaction();
    req.inst = {...req.inst  , t }
    next()
})

exports.initConfig = catchAsync(async(req , res , next)=>{
    const t =  req.inst.t
    let isPost  = (req.method == 'POST')

    var configs =  []

    // var ad = null;
    if(isPost){
        console.log("req body ", req.body)
        await( Promise.all(req.body.map(async key=>{
            let config = await Config.create(key, {transaction : t} );
            configs.push(config.dataValues.config_id)
        })))
  
    }else{

        await( Promise.all(req.body.map(async config=>{
            let {config_id , ...data}  =  config

             await Config.update(
                data ,  
                {
                    where : {config_id}
                }, 
                {transaction : t} );
            configs.push(config_id)
        })))

    }

    req.inst = {...req.inst , configs}
    
    next()
})


exports.clickAd = catchAsync(async(req , res , next)=>{
    const t =  req.inst.t
    const ad =  req.inst.ad

    // var ad = null;
    ad.increment({clickes : 1}  )
    await ad.save({transaction : t})

    

    
    req.inst = {...req.inst  , ad }
    next()
})





exports.handleRefrenceFiles  = catchAsync(async(req , res , next)=>{
    const t =  req.inst.t
    const host = process.env.HOST;
    let isPost  = (req.method == 'POST')
    const ad = req.inst.ad
    if (isPost && !req.files["file"]) {
        return next(new AppError("no_picture_is_provided", 304))
    }

    if(req.files["file"]){
        const fileObj = req.files["file"][0]
        
        const name = req.body.ad_name ? req.body.ad_name : ""
        const url = host + "images/ads/" + fileObj.filename
        const type = fileObj.mimetype
        await ad.createFile({ url, type  , name} , {transaction : t})
    }
    next()
})

exports.handleDuration  = catchAsync(async(req , res , next)=>{
    const t =  req.inst.t
    const ad =  req.inst.ad
    let duration = req.body.duration

    var duration_name , duration_value ; 
    if(duration){
        duration_name  = duration.duration_name
        duration_value  = duration.duration_value
    }
   

   if(duration_name &&  duration_value ){
        duration =  await Duration.findOne({where : {duration_name ,  duration_value}})
        if(!duration){
            await  ad.createDuration({duration_name ,  duration_value}, {transaction : t})
        } else{
            await  ad.setDuration(duration.dataValues.duration_id, {transaction : t})
        }
    }

    t.commit()
    
    
    next()
})


