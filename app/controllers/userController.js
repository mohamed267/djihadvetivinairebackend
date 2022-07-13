/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
/*sequelize */
const { Op } = require("sequelize");

/*models */
const db = require("../server/models/index")
const Files = db.file
const User = db.user
const SocialAccount = db.social_account



/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')


/*api features */
const Apifeatures = require('../utils/apiFeatures')



/*gets */


exports.getUsers  = catchAsync(async(req , res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await User.findAndCountAll({ ...features ,
        include : [
            {model : Files , as : "profilePicture"},
            {model : SocialAccount }
        ]
    })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `users`,
        data: {
            count,
            days: rows
        }
    })
})


exports.getUser  = catchAsync(async(req , res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const user = await User.findOne({ ...features ,
        include : [
            {model : Files , as : "profilePicture"},
            {model : SocialAccount }
        ]
    })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `user`,
        data: user
    })
})

exports.EditProfile  = catchAsync(async(req , res , next)=>{
    const  photo =  req.inst.photo
    const user_id = req.inst.user.dataValues.user_id
    if(photo){
        await User.update({ picture_profile_id : photo.file_id } , {where : {user_id}})
    }
     tokenInterceptor(req, res, next, {
        status: "success",
        message: `profile_updated_succefully`
    }) 
})


