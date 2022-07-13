

/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const { singleUpload } = require('../controllers/uploadController')
/*models */
const db   = require("../server/models/index")
const account_work = require("../server/models/account_work")
const Files = db.file
const AccountContact = db.account_contact
const AccountType = db.account_type
const AccountExperty = db.account_experty
const Service = db.service
const AccountService = db.account_service
const Experty = db.experty
const Account  =  db.account
const Address = db.address
const KeyWords = db.key
const AccountKey = db.account_key
const AccountWork =  db.account_work
const WorkFile = db.work_file








exports.handleRefrenceFilesProfPic  = catchAsync(async(req , res , next)=>{

    
    
    const account =  req.inst.account

    const  t  = req.inst.t;
    req.inst = {...req.inst  ,  t}


    const host = process.env.HOST;
    
    let isPost  = (req.method == 'POST')
    console.log("post is ", isPost)

    req.inst = {...req.inst , profilePic : null}
    if(req.files["profilePic"]){
        const fileObj = req.files["profilePic"][0]
        console.log(req.files["profilePic"])

        const { service_name } = req.body
        const url = host + "images/accounts/" + fileObj.filename
        const type = fileObj.mimetype
        await account.createProfilePic({ url, type  , name: service_name} , {transaction : t})
        req.inst = {...req.inst }
    }
    next()
})


exports.handleRefrenceFilesWorks  = catchAsync(async(req , res , next)=>{
    
    const account_service_id  =  req.body.account_service_id;

    let account_service = 
        account_service_id && 
        await AccountService.findByPk(account_service_id);



    if(!account_service){
        return next(new AppError('no_account_service_found' , 404))
    }





    const host = process.env.HOST;
    let isPost  = (req.method == 'POST')

    req.inst = {...req.inst , files : null}
    if(req.files && req.files["file"]){
        
        const account_work = await AccountWork.create({account_service_id});

        let promise = req.files["file"].map(async (file , key) =>{
            const fileObj = file
            const url = host + "images/works/" + fileObj.filename
            const type = fileObj.mimetype
            const  work_file =  await account_work.createFile({ url, type  , name: "work "+key})
            return work_file
        })

        req.inst = {
            ...req.inst , 
            account_work : account_work.dataValues , 
            files : await Promise.all(promise)
        }
    }

    

    next()
})

exports.initTransaction = catchAsync(async(req , res , next)=>{
    const  t  = await  db.sequelize.transaction();
    req.inst = {...req.inst  , t }
    next()
})

exports.initiateAccount = catchAsync(async(req , res , next)=>{
    
    let isPost  = (req.method == 'POST')
    const {account_type_id} =  req.body
    const user = req.inst.user
    const {account_id} = req.query

    const { t} = req.inst
    var account = null;
    if(isPost){
        account =  await user.createAccount({} , {transaction : t});
    }else{
        
        account = await Account.findByPk(account_id , {
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
        });
        if(!account){
            return next(new AppError("no_account_found" , 404))
        }

    }

    

    let address = req.body.address 
    // && JSON.parse(req.body.address);
    address = address && await account.createAddress(address ,  {transaction : t})

    const account_type = account_type_id &&  await AccountType.findByPk(account_type_id)
    if(account_type_id && !account_type){
        return next(new AppError("invalid_account_type" , 404))
    }

    await account.setAccount_type(account_type_id , {transaction : t})

    

    req.inst = {...req.inst  , account }
    next()
})



exports.handleContactAccount = catchAsync(async(req , res , next)=>{
    let isPost  = (req.method == 'POST')

    const t =  req.inst.t
    const account =  req.inst.account
    if(isPost){

        let {contact_accounts} = req.body;
        contact_accounts = contact_accounts 
        // && JSON.parse(contact_accounts)

        const promise = contact_accounts && contact_accounts.map(async el=>{
            
            await account.createAccount_contact(
                el ,  
                {transaction :  t}
            );
           
            
            
        })
        contact_accounts = contact_accounts && await Promise.all(promise)
    }else{
        let contact_accounts_deleted = req.body.contact_accounts_deleted;
        let contact_accounts_added = req.body.contact_accounts_added;
        contact_accounts_deleted = contact_accounts_deleted 
        // && JSON.parse(contact_accounts_deleted)
        contact_accounts_added = contact_accounts_added 
        // && JSON.parse(contact_accounts_added)
        contact_accounts_deleted && await Promise.all(contact_accounts_deleted.map(async id =>{
            // const account = 
        
            await AccountContact.destroy(
                {
                    where : { id }
                },
                    
                {transaction :  t}
            );
            
        }))
        
        

        contact_accounts_added && await Promise.all(contact_accounts_added.map(async el =>{
            // const account = 
        
             await account.createAccount_contact(
                el ,  
                {transaction :  t}
            );
            
        }))
    }


   


    

    req.inst= {...req.inst  }
    next()
})


exports.handleKeys = catchAsync(async(req , res , next)=>{
    let isPost  = (req.method == 'POST')

    const t =  req.inst.t
    const account =  req.inst.account



    if(isPost){
        let {account_keys} = req.body;

        account_keys = account_keys 
        // && JSON.parse(account_keys)

        account_keys && await Promise.all(account_keys.map(async el=>{
            let key=  await KeyWords.findByPk(el);
            if(!key){
                return next(new AppError("key_not_found"))
            }
            await account.addKey(el , {transaction :  t})
        }))

    }else{
        let account_keys_added = req.body.account_keys_added
        let account_keys_deleted = req.body.account_keys_deleted

        account_keys_added = account_keys_added 
        // && JSON.parse(account_keys_added)

        account_keys_added && await Promise.all(account_keys_added.map(async el=>{
            let key=  await KeyWords.findByPk(el);
            if(!key){
                return next(new AppError("key_not_found"))
            }
            await account.addKey(el , {transaction :  t}) 
        }))

        account_keys_deleted = account_keys_deleted 
        // && JSON.parse(account_keys_deleted)

        account_keys_deleted && await Promise.all(account_keys_deleted.map(async el=>{
            let key=  await KeyWords.findByPk(el);
            if(!key){
                return next(new AppError("key_not_found"))
            }
            await account.removeKey(el , {transaction :  t})
        }))

    }

    req.inst= {...req.inst  }
    next()

})


exports.handleExperties = catchAsync(async(req , res , next)=>{
    let isPost  = (req.method == 'POST')
    
        console.log('we are update ', isPost);

    const t =  req.inst.t
    const account =  req.inst.account
    if(isPost){

        let account_experties = req.body.account_experties;

        account_experties = account_experties 
        // && JSON.parse(account_experties)

        

        account_experties && await Promise.all(account_experties.map(async el=>{
            let experty_id = el.experty_id
            let experty=  await Experty.findByPk(experty_id);
            if(!experty){
                return next(new AppError("type_experty_not_found"))
            }
             await account.createAccount_experty(
                el , {transaction :  t});

        }))
    }else{
        let account_experties_added = req.body.account_experties_added
        let account_experties_deleted = req.body.account_experties_deleted

        account_experties_added = account_experties_added 
        // && JSON.parse(account_experties_added)

        account_experties_added && await Promise.all(account_experties_added.map(async el=>{
            let experty=  await Experty.findByPk(el.experty_id);
            if(!experty){
                return next(new AppError("type_experty_not_found"))
            }
            await account.createAccount_experty(el , {transaction :  t}) 
        }))

        account_experties_deleted = account_experties_deleted 
        // && JSON.parse(account_experties_deleted)

        account_experties_deleted && await Promise.all(account_experties_deleted.map(async el=>{
            console.log("exper delete ",el)
            let accountExperty=  await AccountExperty.findByPk(el);
            if(!accountExperty){
                return next(new AppError("experty_not_found"))
            }
            await account.removeAccount_experty(el , {transaction :  t})
        }))

    }

    req.inst= {...req.inst }
    next()

})




exports.handleServices = catchAsync(async(req , res , next)=>{
    let isPost  = (req.method == 'POST')
    const t =  req.inst.t
    const account =  req.inst.account
    let services = req.body.services 
    // && JSON.parse(req.body.services);
    if(isPost){
        services && await Promise.all(services.map(async el=>{
            let {service_id} = el
            let service=  await Service.findByPk(service_id , {include : Service});
            if(!service){
                return next(new AppError("service_not_found"))
            }
            const account_service = await account.createAccount_service(
                el ,   {transaction :  t}  );
        }))
    }else{
        console.log("we are update");
        let account_services_added = req.body.account_services_added
        let account_services_deleted = req.body.account_services_deleted
        console.log(account_services_deleted)

        account_services_added = account_services_added 
        // && JSON.parse(account_services_added)

        account_services_added && await Promise.all(account_services_added.map(async el=>{
            let {service_id} = el
            let service=  await Service.findByPk(service_id , {include : Service});
            if(!service){
                return next(new AppError("service_not_found"))
            }
            const account_service = await account.createAccount_service(
                el ,   {transaction :  t}  ); 
        }))

        account_services_deleted = account_services_deleted 
        // && JSON.parse(account_services_deleted)

        account_services_deleted && await Promise.all(account_services_deleted.map(async el=>{
            console.log("deleting ",el)
            let account_service=  await AccountService.findByPk(el);
            if(!account_service){
                return next(new AppError("account_service_not_found"))
            }
            await account.removeAccount_service(
                el ,   {transaction :  t}  );
        }))

    }

    next();

})



exports.handleSearchQuery = catchAsync(async(req , res , next)=>{
    next()
})





