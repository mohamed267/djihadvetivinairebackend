

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

exports.initTransaction = catchAsync(async(req , res , next)=>{
    const  t  = await  db.sequelize.transaction();
    req.inst = {...req.inst  , t }
    next()
})

exports.handleFields = catchAsync(async(req , res , next)=>{
    let form_field = await FormField.findAll()
    let fields = {}

    form_field.map(field =>{
        fields[field.form_field_id] = field.form_field_type
    })

    req.inst = {...req.inst  , fields }
    next()
})

exports.handleRegion = catchAsync(async(req , res , next)=>{
    let region_id = req.body.region_id 
    let region = await Region.findByPk(region_id)
    req.inst = {...req.inst  , region }
    next()
})



exports.initiateform = catchAsync(async(req , res , next)=>{
    let fields = req.inst.fields
    let region = req.inst.region
    let form_id = req.query.form_id
    console.log("query gg ", req.body)
    let  {form , region_id , ...body} =  req.body
    let formData = form


    let isPost = req.method == "POST"
    form = null
    if(isPost){
        form = await region.createForm(body)
    }else{
        form = await Form.findByPk(form_id)
        form.set(body)
        await form.save()
    }


    formData && await(Promise.all(Object.keys(formData).map(async field=>{
        if(isPost){
            if(fields[field]==="BOOLEAN"){
                await form.createBoolean_field({field_value :formData[field], form_field_id : field })
            }else if(fields[field]==="TEXT"){
                await form.createText_field({field_value :formData[field]   ,form_field_id : field})
            }else if(fields[field]==="NUMBER"){
                await form.createNumber_field({field_value :formData[field]  ,form_field_id : field })
            }else if(fields[field]==="GPS"){
                await form.createAddress_field({...formData[field]  ,form_field_id : field })
            }else if(fields[field]==="ADDRESS"){
                await form.createAddress_field({...formData[field] , form_field_id : field } )
            }else if(fields[field]==="DATE"){
                await form.createDate_field({field_value :formData[field]  ,  form_field_id : field})
            }else if(fields[field]==="SELECT"){
                await form.createString_field({field_value :formData[field].field_option_value  ,  form_field_id : field})
            }else if(fields[field]==="COMPLEXSELECT"){
                await form.createString_field({
                    field_value :formData[field].field_option_value + "_*_"+ formData[field].extra ,  
                    form_field_id : field})
            }else if(fields[field]==="STRING"){
                await form.createString_field({
                    field_value :formData[field] ,  
                    form_field_id : field})
            }
        }
        
        else{

            if(fields[field]==="BOOLEAN"){
                let res = await form.getBoolean_fields({where : {form_field_id : field}})
                res = res[0];
                res && res.set({field_value :formData[field] }) && await res.save()
            }else if(fields[field]==="STRING"){               
                let res = await form.getString_fields({where : {form_field_id : field}})
                res = res[0];
                res && res.set({field_value :formData[field] }) && await res.save()
           }else if(fields[field]==="TEXT"){
                let res = await form.getText_fields({where : {form_field_id : field}})
                res = res[0];
                res && res.set({field_value :formData[field] }) && await res.save()
            }else if(fields[field]==="NUMBER"){
                let res = await form.getNumber_fields()
                res = res[0];
                res && res.set({field_value :formData[field] }) && await res.save()
            }else if(fields[field]==="ADDRESS" || fields[field]==="GPS"){
                let res = await form.getAddress_fields({where : {form_field_id : field}})
                res = res[0];
                console.log("res ", res)
                res && res.set(formData[field]) && await res.save()
            }else if(fields[field]==="DATE"){
                let res = await form.getDate_fields({where : {form_field_id : field}})
                res = res[0];
                res && res.set({field_value :formData[field] }) && await res.save()
            }else if(fields[field]==="COMPLEXSELECT"){ 
                let res = await form.getString_fields({where : {form_field_id : field}})
                res = res[0];
                res && res.set({field_value :formData[field].field_option_value + "_*_"+ formData[field].extra  }) && await res.save()
            }else if(fields[field]==="SELECT"){ 
                let res = await form.getString_fields({where : {form_field_id : field}})
                res = res[0];
                res && res.set({field_value :formData[field].field_option_value  }) && await res.save()
            }
        }
        
    })))

    req.inst = {...req.inst , form}
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

