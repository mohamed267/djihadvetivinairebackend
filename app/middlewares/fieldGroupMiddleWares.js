

/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const { singleUpload } = require('../controllers/uploadController')
/*models */
const db = require("../server/models/index")
const FieldGroup = db.field_group
const FormField = db.field_group

exports.initTransaction = catchAsync(async(req , res , next)=>{
    const  t  = await  db.sequelize.transaction();
    req.inst = {...req.inst  , t }
    next()
})


exports.initaiteFieldGroup = catchAsync(async(req , res , next)=>{
    let isPost = (req.method == "POST");
    const field_group_id = req.query.field_group_id
    let field_group = null

    if(isPost){
        field_group =  await FieldGroup.create(req.body)
    }else{
        field_group = await FieldGroup.findByPk(field_group_id)
        field_group.set(req.body)
        await field_group.save()
    }




  

    req.inst = {...req.inst  , field_group }
    next()
})

