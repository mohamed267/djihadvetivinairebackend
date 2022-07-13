
/*time handle */
const moment =  require('moment')


/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const { singleUpload } = require('../controllers/uploadController')
/*models */
const db = require("../server/models/index")
const subscription = require('../server/models/subscription')
const Duration = db.duration
const Plan =  db.plan_subscription
const Files =  db.file
const Subscription = db.subscription
const PaymentMethod = db.payment_method








exports.handleDuration  = catchAsync(async(req , res , next)=>{
    const {duration_name ,  duration_value} = req.body

    if(!duration_name  || ! duration_value){
        return(next(new AppError('duration_info_not_provided')))
    }

    let duration =  await Duration.findOne({where : {duration_name ,  duration_value}})

    if(!duration){
        duration = await  Duration.create({duration_name ,  duration_value})
    }

    req.body = {...req.body , duration_id :duration.dataValues.duration_id }



    next()
})
exports.handlePaymentMethod = catchAsync(async(req , res , next)=>{
    const {payment_method_id} = req.body

    
    let payment_method =  await PaymentMethod.findByPk(payment_method_id);
    if(!payment_method){
       return (next(new AppError("no_payment_method_found" , 404)))
    }
    next()
})


/*handle receipt upla=oad */

exports.handleRefrenceFiles  = catchAsync(async(req , res , next)=>{
    const host = process.env.HOST;
    let isPost  = (req.type == 'POST')
    console.log("post is ", isPost)

    req.inst = {...req.inst , photo : null}
    if(req.files["file"]){
        const fileObj = req.files["file"][0]
        console.log(req.files["file"])
        const url = host + "images/receipts/" + fileObj.filename
        const type = fileObj.mimetype
        const pic = await Files.create({ url, type  , name: "receipt"})

        req.inst = {...req.inst , photo : pic.dataValues}
    }

    next()
})



/*handle duration subscriptions*/


exports.handlePlanSubscriptions  = catchAsync(async(req , res , next)=>{
    const {plan_id} =  req.body;

    let plan =  await Plan.findByPk(plan_id);
    if(!plan){
        return next (new AppError('no_plan_found' , 404))
    }
    const {duration_id , plan_subscription_price} = plan.dataValues;

    const duration =  await Duration.findByPk(duration_id);

    const {duration_name , duration_value} =  duration.dataValues;

    const timeNow = moment()

    let subscription_expires_at = timeNow.add(duration_name , duration_value)

    req.body = {...req.body ,
        subscription_expires_at : subscription_expires_at.toDate() ,
        subscription_price : plan_subscription_price
    }
    next()

})

/*handle find subscription */

exports.handleFindSubscription = catchAsync(async(req , res , next)=>{
    const {subscription_id} =  {...req.body ,  ...req.params };

    const subscription =  await Subscription.findByPk(subscription_id);

    if(!subscription){
        return next (new AppError("no_subscription_found" , 401))
    }

    



    const plan_id = subscription.dataValues.plan_id
    const user_id = subscription.dataValues.user_id
    


    req.inst = {...req.inst , subscription }
    req.body = {...req.body , plan_id  }


    
    next()

})

/*  restrict to owner */


exports.restrictToOwner  = catchAsync(async(req , res , next)=>{
    let subscription =  req.inst.subscription;
    
    const user_id = req.inst.user.user_id


    if(subscription.dataValues.user_id != user_id){
        return next(new AppError("not_authorized" , 401))

    }

    next()

})


