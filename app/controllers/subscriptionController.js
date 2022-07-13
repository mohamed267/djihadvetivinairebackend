/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
/*sequelize */
const { Op } = require("sequelize");

/*models */
const db = require("../server/models/index")
const Ad = db.ad
const Files = db.file
const Plan=  db.plan_subscription
const Subscription =  db.subscription
const User =  db.user
const PaymentMethod = db.payment_method
const Duration = db.duration


/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')


/*api features */
const Apifeatures = require('../utils/apiFeatures');
const user = require("../server/models/user");


/*Crud plans pf subcription */


exports.getPlans  = catchAsync( async(req , res , next)=>{

    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await Plan.findAndCountAll({
        ...features,
        include :  Duration
    }
    )
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `plans`,
        data: {
            count,plans: rows
        }
    })
   
    
})
exports.createPlan  = catchAsync(async(req , res , next)=>{
    let plan = await Plan.create(
    { 
        ...req.body
    })

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `plan_created_succefully`,
        data: plan
    })
})
exports.updatePlan  = catchAsync( async(req , res , next)=>{
    let { plan_subscription_id } = { ...req.params, ...req.query }
    

    await Plan.update(
        { 
            ...req.body
        },{
            where : {
                plan_subscription_id
            }
        }
    )

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `plan_updated_succefully`,
        data : req.body
    })
    
})
exports.deletePlan  = catchAsync( async(req , res , next)=>{
    let { plan_subscription_id } = { ...req.params, ...req.query }
    let plan = await Plan.findByPk(plan_subscription_id)
    if(!plan){
        return next(new AppError("no_plan_found",404))
    }

    await plan.destroy()

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `plan_deleted_succefully`
    })
    
})


/*payment method */

exports.getPaymentMethods  = catchAsync( async(req , res , next)=>{

    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await PaymentMethod.findAndCountAll({
        ...features,

    }
    )
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `paymentMethods`,
        data: {
            count,
            paymentMethods: rows
        }
    })
   
    
})

exports.createPaymentMethod = catchAsync(async(req , res , next)=>{
    let paymment_method = await PaymentMethod.create(
    { 
        ...req.body
    })

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `payment_method_created_succefully`,
        data: paymment_method
    })
})
exports.updatePaymentMethod = catchAsync( async(req , res , next)=>{
    let { payment_method_id } = { ...req.params, ...req.query }
    

    await PaymentMethod.update(
        { 
            ...req.body
        },{
            where : {
                payment_method_id
            }
        }
    )

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `payment_method_updated_succefully`,
        data : req.body
    })
    
})
exports.deletePaymentMethod  = catchAsync( async(req , res , next)=>{
    let { payment_method_id } = { ...req.params, ...req.query }
    let payment_method = await PaymentMethod.findByPk(payment_method_id)
    if(!payment_method){
        return next(new AppError("no_payment_method_found",404))
    }

    await payment_method.destroy()

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `payment_method_deleted_succefully`
    })
    
})






/*subscriptions */



exports.getSubscriptions  = catchAsync( async(req , res , next)=>{

    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await Subscription.findAndCountAll({
        ...features,

    }
    )
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `subscriptions`,
        data: {
            count,
            subscriptions: rows
        }
    })
   
    
})

/*get subscription */
exports.getSubscription  = catchAsync( async(req , res , next)=>{
    const user = req.inst.user
    let subscription = await user.getSubscriptions({
        where : {
            subscription_expires_at : {
                [Op.gte] : new Date()
            },
            subscription_confirmed : true
        }

    }
    )

   

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `subscription`,
        data: subscription[0] ? subscription[0] : null
    })
   
    
})


exports.createSubscription  = catchAsync(async(req , res , next)=>{
    const user =  req.inst.user
    const {photo} = req.inst
    let obgReceipt ={} 

    if(photo){
        obgReceipt  =   {receipt_id	: photo.file_id}
    }






    let subscription = await user.createSubscription(
        {
            ...req.body,
            ...obgReceipt,
            subscription_confirmed : false
        })

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `subscription_created_succefully`,
        data: subscription
    })


    
})

exports.updateSubscription  = catchAsync( async(req , res , next)=>{
    const {photo , subscription} = req.inst
    let obgUpdate = { }
    if (photo) {
        obgUpdate = {  receipt_id	: photo.file_id }
    }

    subscription.set(
        { 
            ...obgUpdate,
            ...req.body
        }
    )
    await subscription.save();

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `subscription_updated_succefully`,
        data : {
            ...obgUpdate,
            file : photo,
            ...req.body

        }
    })
    
})

/*subscription status */


exports.updateSubscriptionStatus  = catchAsync( async(req , res , next)=>{
    const subscription =  req.inst.subscription;
    const user =  req.inst.user_id;
    const subscription_confirmed = req.body.subscription_confirmed;
    const subscription_expires_at =  req.body.subscription_expires_at;
    subscription.set({
        subscription_expires_at,
        subscription_confirmed
    })
    await subscription.save()

    if(subscription_confirmed){
       user.update({subscriped :  true}  )
        await user.save()
    }

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `subscription_updated_succefully`,
        data : {
            subscription_expires_at,
            subscription_confirmed
        }
    })




})
 


