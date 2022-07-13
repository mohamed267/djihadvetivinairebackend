const jwt = require("jsonwebtoken");
const { promisify } = require("util")
const moment = require("moment");
const createVerifCode = require("generate-sms-verification-code");
const  { getAuth  } =  require('firebase-admin/auth');
const {Op} = require("sequelize")
/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')

/*jwt */
const { signJwt, signRefreshJwt, verify, verify_refresh_token } = require("../utils/jwt")

/*models */
const db = require("../server/models/index");
const Admin = db.admin
const Wilaya = db.wilaya
const Account = db.account
const SocialAccount = db.social_account
const Config =  db.config
const AuthAccount = db.auth_account
const User = db.user
const VerificationCode = db.verification_code
const Files = db.file



const createSendToken = (data, statusCode, message, res ) => {
    const token = signJwt(data);
    const refreshToken = signRefreshJwt(data)
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 365 * 24 * 3600 * 1000)
    }
    res.cookie('refreshToken', refreshToken, cookieOptions);
    tokenInterceptor( {} ,  res , null ,  {
        status: "success",
        message,
        data: { ...data, token }
    } );
};


exports.extractToken = catchAsync(async(req,res,next)=>{
    //? 1) GETTING THE TOKEN FROM THE HEADERS
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else {
        return next(new AppError("not_logged_in", 401));
    }

    req.inst  = {...req.inst ,  token}
    next()
})


exports.protect = catchAsync(async (req, res, next) => {
    const {token} = req.inst
    //? DECODING THE TOKEN & CHECKING IF ITS VALID
    const decoded = await verify(token);
    
    const currentAdmin = await Admin.findByPk(
        decoded.id
    );

    if (!currentAdmin) return next(new AppError("user_not_found", 401));
    // if (currentUser.suspended) {
    //     return next(new AppError("you are suspended please contact us for more details ", 400))
    // }
    // if (!currentUser.confirmed) {
    //     return next(new AppError("please confirm your email !!", 400))
    // }
    //? 3) IF EVERYTHING OK RETURN THE USER

    req.inst = { ...req.inst, admin: currentAdmin
        // .dataValues
        , decoded };

    next();
});


/*login*/

/*login */
exports.loginAdmin = catchAsync(async (req, res, next) => {
    const { admin_username , admin_password } = req.body
    const existAdmin =await  Admin.findOne(
        { where : { admin_username} })

    // const user = email && await getAuth().getUserByEmail(email);
    // const  userPhoneNumber = phoneNumber &&  await getAuth().getUserByPhoneNumber(phoneNumber)
    
    if(!existAdmin){
        return next(new AppError("invalid_email_or_password", 400));
    }

    let admin = existAdmin.dataValues

    if (!admin || !(await Admin.correctPassword(admin_password, admin.admin_password))) {
        return next(new AppError("invalid_email_or_password", 400));
    }
    let type ="admin"
    createSendToken({ ...admin, logedIn: true, lastLogedIn: new Date(), type }, 200, "you_are_authenticated", res)
});


exports.createAdmin = catchAsync(async (req, res, next) => {
    const { admin_username , admin_password } = req.body
    const admin =await  Admin.create(
        {  admin_username , admin_password})


    tokenInterceptor(req, res, next, {
        status: "success",
        message: "admin_created",
        data :admin
    })

});



exports.changePasswordKnown = catchAsync(async (req, res, next) => {
    const admin =  req.inst.admin
    const { old_password, admin_password } = req.body


    if (!old_password && !admin_password) {
        return next(new AppError("please_provide_old_password_and_new", 403));
    }


    if (!(await Admin.correctPassword(old_password, admin.dataValues.admin_password))) {
        return next(new AppError("invalid_password", 400));
    }

    admin.set({admin_password})
    await admin.save()

    tokenInterceptor(req, res, next, {
        status: "success",
        message: "password_updated_succefully"
    })
});





















    


     
