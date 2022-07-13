/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
/*sequelize */
const { Op } = require("sequelize");

/*models */
const db = require("../server/models/index")
const Ad = db.ad
const Files = db.file
const Service=  db.service
const Account = db.account
const AccountType = db.account_type
const Experty = db.experty
const AccountExperty = db.account_experty
const KeyWords =  db.key
const AccountService = db.account_service
const AccountWork = db.account_work
const Address  =  db.address
  

/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')


/*api features */
const Apifeatures = require('../utils/apiFeatures')

/*gets */

exports.getAccountType  = catchAsync(async(req , res , next)=>{

    const {search} = req.query

    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await AccountType.findAndCountAll({
        ...features
    })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `account_types`,
        data: {
            count,
            accountTypes: rows
        }
    })
})


/*get experties */


exports.getExperties  = catchAsync(async(req , res , next)=>{

    const {search} = req.query

    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await Experty.findAndCountAll({
        ...features
    })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `experties`,
        data: {
            count,
            experties: rows
        }
    })
})

/*get keys */


exports.getKeys  = catchAsync(async(req , res , next)=>{

    const {search} = req.query

    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await KeyWords.findAndCountAll({
        ...features
    })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `keys`,
        data: {
            count,
            keys: rows
        }
    })
})



/*get accounts */

exports.getAccounts = catchAsync(async(req , res , next)=>{
    const {user_id} = req.inst.user.dataValues
    const accounts= await Account.findAll({
        where:{user_id},
        include : [
            {
                model : AccountType , 
            },
            {
                model : AccountExperty , 
                include : Experty
            },
            {
                model : Files ,
                as :  "profilePic"
            },
            {
                model : KeyWords
            },
            {
            model : Address
            },
            {
                model : AccountService ,
                include : [
                    {
                        model : AccountWork ,
                        include : [
                            {
                                model : Files 
                            }
                        ]
                    },
                    {
                        model : Service ,
                        include : [
                            {
                                model : Service 
                            }
                        ]
                    }
                ]
            }
            
        ]
    })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `accounts`,
        data: accounts
    })
})



exports.filterAccounts = catchAsync(async(req,res, next)=>{
    // const features = new Apifeatures(req.query).filter().sort().paginate().queryObj

    const longtitude = req.query.longtitude
    const latitude = req.query.latitude
    

    let address = {longtitude , latitude};

    Object.keys(address).forEach(key => address[key] === undefined ? delete address[key] : {});

    address  = (address.longtitude || address.latitude)  ? {
        required: true,
        through: {
            ...new Apifeatures(address).filter().queryObj
        }
    }:{}


    console.log( address)
    let features = new Apifeatures(req.query).filter().queryObj
    console.log(features);
    
    const { count, rows } = await Account.findAndCountAll(
        { 
           ...features,
            include : [
                {
                    model : AccountType , 
                },
                {
                    model : AccountExperty , 
                    include : Experty
                },
                {
                    model : Address,
                },
                {
                    model : Files ,
                    as :  "profilePic"
                },
                {
                    model : KeyWords
                },
                {
                    model : AccountService ,
                    include : [
                        {
                            model : AccountWork ,
                            include : [
                                {
                                    model : Files 
                                }
                            ]
                        },
                        {
                            model : Service ,
                            include : [
                                {
                                    model : Service 
                                }
                            ]
                        }
                    ]
                }
            ]

        }
    )
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `accounts`,
        data: {
            count,
            accounts: rows
        }
    })
})




exports.addAccount  = catchAsync(async(req , res , next)=>{
    
    let account = req.inst.account;
    
    const t = req.inst.t





    t.commit()
    account =   await Account.findByPk(
        account.dataValues.account_id,
        {        
            include : [
            {
                model : AccountType , 
            },
            {
                model : AccountExperty , 
                include : Experty
            },
            {
                model : Files ,
                as :  "profilePic"
            },
            {
                model : KeyWords
            },
            {
                model : Address
            },
            {
                model : AccountService ,
                include : [
                    {
                        model : AccountWork ,
                        include : [
                            {
                                model : Files 
                            }
                        ]
                    },
                    {
                        model : Service ,
                        include : [
                            {
                                model : Service 
                            }
                        ]
                    }
                ]
            }
            
            ]
        }
    );

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `account_created_succefully`,
        data:   account
    })
})

exports.editAccount = catchAsync (async(req , res , next)=>{
    let account = req.inst.account;
    const t = req.inst.t

    t.commit()

    account =   await Account.findByPk(
        account.dataValues.account_id,
        {        
            include : [
            {
                model : AccountType , 
            },
            {model : Address},
            {
                model : AccountExperty , 
                include : Experty
            },
            {
                model : Files ,
                as :  "profilePic"
            },
            {
                model : KeyWords
            },
            {
                model : AccountService ,
                include : [
                    {
                        model : AccountWork ,
                        include : [
                            {
                                model : Files 
                            }
                        ]
                    },
                    {
                        model : Service ,
                        include : [
                            {
                                model : Service 
                            }
                        ]
                    }
                ]
            }
            
            ]
        }
    );





    tokenInterceptor(req, res, next, {
        status: "success",
        message: `account_updated_succefully`,
        data:   account
    })
})


/*works */


exports.addWork = catchAsync(async(req , res , next)=>{
    const {account_work , files} = req.inst

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `work_added_succefully`,
        data:   {
            ...account_work,
            files
        }
    })
})

exports.deleteWork = catchAsync(async(req , res , next)=>{
    const account_work_id = req.query.account_work_id
    console.log(account_work_id)
    const account_work = await AccountWork.findByPk(account_work_id);
    await account_work.destroy()

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `work_deleted_succefully`
    })
})


