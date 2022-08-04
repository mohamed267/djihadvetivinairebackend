

/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const { singleUpload } = require('../controllers/uploadController')
/*models */
const db = require("../server/models/index")
const form_field = require("../server/models/form_field")
const { from } = require("form-data")
const FieldGroub = db.field_group
const Form = db.form
const FormField = db.form_field
const Region = db.region





exports.initiateRegion = catchAsync(async(req , res , next)=>{
    console.log("data is ", req.body)

    let {region_id , createdAt , updatedAt , wilayas , deleted_wilayas , ...data} = req.body
    
    region_id = req.query.region_id
    let isPost = req.method == "POST"
    var form = null
    let region ;
    if(isPost){
        region = await Region.create(data)
    }else{
        region = await Region.findByPk(region_id)
        region.set(data)
        await region.save()
    }

    
    req.inst = {...req.inst , region}
    next()
})

exports.handleWilayas = catchAsync(async(req , res , next)=>{
    let region  = req.inst.region
    let {wilayas , deleted_wilayas } = req.body

    console.log("deleted query ",deleted_wilayas )

    
    deleted_wilayas && await Promise.all(deleted_wilayas.map(async wilaya=>{
        await region.removeWilaya(wilaya)
    }))

    
    wilayas && await Promise.all(wilayas.map(async wilaya=>{
        await region.addWilaya(wilaya)
    }))
    
    req.inst = {...req.inst , region}
    next()
})


