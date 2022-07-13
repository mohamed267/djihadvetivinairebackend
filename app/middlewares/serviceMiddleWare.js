

/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const { singleUpload } = require('../controllers/uploadController')
/*models */
const db = require("../server/models/index")
const Files = db.file
const Service = db.service
const Restriction = db.restriction


exports.initTransaction = catchAsync(async(req , res , next)=>{
    const  t  = await  db.sequelize.transaction();
    req.inst = {...req.inst  , t }
    next()
})

exports.initService = catchAsync(async(req , res , next)=>{
    
    let isPost  = (req.method == 'POST')
    const {service_id } =  req.params

    const { t} = req.inst
    var service = null;
    if(isPost){
        service =  await Service.create({...req.body} , {transaction : t});
    }else{
        
        service = await Service.findByPk(service_id );
        if(!service){
            return next(new AppError("no_service_found" , 404))
        }

    }

    

    
    req.inst = {...req.inst  , service }
    next()
})




exports.handleRefrenceFiles  = catchAsync(async(req , res , next)=>{
    const host = process.env.HOST;
    let isPost  = (req.method == 'POST')
    const service = req.inst.service
    const t = req.inst.t
    if (isPost && !req.files["file"]) {
        return next(new AppError("no picture is provided ", 304))
    }

    req.inst = {...req.inst , photo : null}
    if(req.files["file"]){
        const fileObj = req.files["file"][0]
        
        const name = req.body.service_name ? req.body.service_name : ""
        const url = host + "images/services/" + fileObj.filename
        const type = fileObj.mimetype
         await service.createFile({ url, type  , name} , {transaction : t})
        req.inst = {...req.inst }
    }
    next()
})


exports.handleRestrictions  = catchAsync(async(req , res , next)=>{
    const host = process.env.HOST;
    let isPost  = (req.method == 'POST')
    const service =  req.inst.service
    const t =  req.inst.t

    let restrictions =  req.body.restrictions ;
    let restrictionsDeleted = req.body.restrictionsDeleted
    restrictions = restrictions 
    // && JSON.parse(restrictions);
    restrictionsDeleted = restrictionsDeleted 
    // && JSON.parse(restrictionsDeleted)

    restrictions && await Promise.all(restrictions.map(async restriction=>{
        await service.createRestriction(restriction , {transaction : t})
    }))

    restrictionsDeleted && await Promise.all(restrictionsDeleted.map(async restriction=>{
        await service.removeRestriction(restriction , {transaction : t})
    }))

    
    next()
})