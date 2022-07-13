const {Op} = require("sequelize")
const  { getAuth  } =  require('firebase-admin/auth');
const passwordGenerator =  require('generate-password')


const db = require("../server/models/index")
/*error handler  *//*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

/*mailing */
const { sendVerificationCode } = require("../utils/nodeMailer");



/*models */
const User = db.user
const Files = db.file
const AuthAccount  =  db.auth_account
exports.register = catchAsync(async (req, res, next) => {
    let { user_display_name , user_password , wilaya_id }  = req.body;
    let {uid  , accounts , displayName } = req.inst;
    user_display_name = user_display_name || displayName
    user_password = user_password || passwordGenerator.generate({length: 10})
    let snapAccounts = [];
    Object.keys(accounts).map(key=>{
        if(accounts[key]){
            snapAccounts.push(accounts[key])
        }
    })


    let existingAccount = await AuthAccount.findOne({
        where : {
            account : {
                [Op.or] : snapAccounts
            }
        
        }
    })

    
    



    if(existingAccount){
        return (next(new AppError('account_already_exist' , 409 )))
    }

    await getAuth().updateUser(uid, {
        password: user_password ,
        displayName: user_display_name 
    })

    const user  =  await  User.create({uid ,user_display_name , user_password , wilaya_id}  )    
    req.inst = {...req.inst , user}; 
    next()
})

exports.handleUpdateName = catchAsync(async (req, res, next) => {
    const { user_display_name }  = req.body;
    let {uid  , user_id  } = req.inst.user;
    await getAuth().updateUser(uid, {
        displayName: user_display_name
    })
     await  User.update(
        {user_display_name } ,
        {where : {user_id}}  
    )  

    next()
    
})




/*handle receipt upla=oad */

exports.handleRefrenceFiles  = catchAsync(async(req , res , next)=>{
    const host = process.env.HOST;

    req.inst = {...req.inst , photo : null}
    if(req.files["file"]){
        const fileObj = req.files["file"][0]
        console.log(req.files["file"])
        const url = host + "images/users/" + fileObj.filename
        const type = fileObj.mimetype
        const pic = await Files.create({ url, type  , name: "user"})

        req.inst = {...req.inst , photo : pic.dataValues}
    }

    next()
})






const verifInst = () => {
    var code = Math.floor(Math.random() * 10);
    if (code === 0) {
        code = verifInst()
    }

    return code
}


exports.createVerificationCode = catchAsync(async (req, res, next) => {
    const { profile, teacher, student, teacher_submition_files } = req.inst
    let i = 0;
    let code = 0;
    while (i < 6) {
        code += verifInst() * 10 ** i
        i++
    }
    await VerificationCode.destroy({ where: { profile_id: profile.id } })
    await VerificationCode.create({ profile_id: profile.id, code })
    let [subject, text] = ["التحقق من البريد الالكتروني ✔", " :   نحن سعداء بوجودك هنا. دعنا نتحقق من عنوان بريدك الإلكتروني     "]
    await sendVerificationCode(profile.email, code, subject, text)
    res.status(200).send({
        status: "success",
        message: "profile was created succefully check your email for verification",
        data: { ...profile, teacher, student, teacher_submition_files }
    })
})




exports.resendVerificationCode = catchAsync(async (req, res, next) => {
    const { email } = req.body
    const profile = await Profile.findOne({ where: { email } })
    if (!profile) {
        return next(new AppError("Profile does not exist", 404));
    }
    let i = 0;
    let code = 0;
    while (i < 6) {
        code += verifInst() * 10 ** i
        i++
    }
    let [subject, text] = ["التحقق من البريد الالكتروني ✔", " :   نحن سعداء بوجودك هنا. دعنا نتحقق من عنوان بريدك الإلكتروني     "]
    await VerificationCode.destroy({ where: { profile_id: profile.id } })
    await VerificationCode.create({ profile_id: profile.id, code })
    await sendVerificationCode(email, code, subject, text)
    res.status(200).send({
        status: "success",
        message: "We've sent a verification code .... please check your email"
    })
})

