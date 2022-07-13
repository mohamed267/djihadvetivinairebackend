

/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const { singleUpload } = require('../controllers/uploadController')
/*models */
const db = require("../server/models/index")
const FieldGroub = db.field_group
const FormField = db.form_field

exports.initTransaction = catchAsync(async(req , res , next)=>{
    const  t  = await  db.sequelize.transaction();
    req.inst = {...req.inst  , t }
    next()
})

exports.handleGroup = catchAsync(async(req , res , next)=>{
    const {field_group_name , field_group_slug} = req.body
    let field_group = null
    if(field_group_slug){
        field_group =  await FieldGroub.findOne({where : {field_group_slug}})
        if(!field_group){
            field_group = await FieldGroub.create({field_group_slug ,  field_group_name})
        }
    }

    req.inst = {...req.inst  , field_group }
    next()
})



exports.initaiteFormField = catchAsync(async(req , res , next)=>{
    let isPost = (req.method == "POST");
    const field_group =  req.inst.field_group
    const {form_field_name , form_field_type , form_field_search} = req.body
    const form_field_id = req.query.form_field_id
    let form_field = null

    if(isPost){
        form_field =  await field_group.createForm_field({form_field_name , form_field_type , form_field_search})
    }else{
        form_field = await FormField.findByPk(form_field_id)
        form_field.set({form_field_name , form_field_type , form_field_search})
        await form_field.save()
    }




  

    req.inst = {...req.inst  , form_field }
    next()
})

exports.handleOptions = catchAsync(async(req , res , next)=>{
    let form_field =  req.inst.form_field
    const field_options =  req.body.field_options
    const field_options_deleted =  req.body.field_options_deleted

    field_options && await Promise.all(field_options.map(async option=>{
        await form_field.createField_option(option)

    }))

    field_options_deleted && await Promise.all(field_options_deleted.map(async option=>{
        await form_field.removeField_option(option)

    }))

    next()
})

