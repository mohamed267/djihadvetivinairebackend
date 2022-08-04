

/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const { singleUpload } = require('../controllers/uploadController')
/*models */
const db = require("../server/models/index")
const form_field = require("../server/models/form_field")
const Wilaya = db.wilaya
const Commune = db.commune





exports.initiateWilaya = catchAsync(async(req , res , next)=>{
    let wilaya_id = req.query.wilaya_id

    let data = req.body

    let isPost = req.method == "POST"
    let wilaya ;
    if(isPost){
        wilaya = await Wilaya.create(data)
    }else{
        wilaya = await Wilaya.findByPk(wilaya_id)
        wilaya.set(data)
        await wilaya.save()
    }

    
    req.inst = {...req.inst , wilaya}
    next()
})

exports.initiateCommune = catchAsync(async(req , res , next)=>{
    let commune_id = req.query.commune_id

    let data = req.body

    let isPost = req.method == "POST"
    let commune;
    if(isPost){
        commune = await Commune.create(data)
    }else{
        commune = await Commune.findByPk(commune_id)
        commune.set(data)
        await commune.save()
    }

    
    req.inst = {...req.inst , commune}
    next()
})


