
/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
/*sequelize */
const { Op } = require("sequelize");

/*models */
const db = require("../server/models/index")
const Config=  db.config
const Region = db.region
const Wilaya =  db.wilaya
const Commune = db.commune
const Daira = db.daira



/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')


/*api features */
const Apifeatures = require('../utils/apiFeatures')





/*wilaya  */

exports.fetchWilaya  = catchAsync(async(req , res , next)=>{
    let wilaya =  req.inst.wilaya
    wilaya = await Wilaya.findByPk(wilaya.dataValues.wilaya_id)
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `wilaya_modified_succefully`,
        data : wilaya
    })
    
})


exports.createWilayas  = catchAsync(async(req , res , next)=>{

    let wilayas =  req.body.wilayas
    await(Promise.all(wilayas.map(async wilaya=>{
        let {wilaya_name , dairas} = wilaya

        let snapWilaya = await Wilaya.findOne({where : {wilaya_name}})
        if(!snapWilaya){
            snapWilaya = await Wilaya.create({wilaya_name   , wilaya_slug : wilaya_name})
        }

        await(Promise.all(dairas.map(async ({daira_name , communes})=>{
            let snapDaira =  await snapWilaya.createDaira({daira_name , daira_slug : daira_name })

            await(Promise.all(communes.map(async (commune_name)=>{
                await snapDaira.createCommune({commune_name , commune_slug : commune_name })
    
            })))

        })))


    })))
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `wilayas_created_succefully`,
    })
    
})











exports.deleteWilaya  = catchAsync(async(req , res , next)=>{
    const features = new Apifeatures(req.query).filter().queryObj
    await Wilaya.destroy({...features})

    // client_demand = await ClientDemend.destroy({where :  {client_demand_id}})

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `wilayas_deleted_succefully`
    })
    
})


exports.getWilayas = catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().queryObj

    const wilayas = await Wilaya.findAll({...features})
    
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `wilayas`,
        data: wilayas
    })
})


exports.getWilayaRegions = catchAsync(async(req, res , next)=>{
    console.log("we are getting ", req.query)
    const features = new Apifeatures(req.query).filter().sort().queryObj

    const region = await Region.findOne({...features , include: [Wilaya]})
    
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `wilaya_regions`,
        data: region ? region.dataValues.wilayas : []
    })
})


exports.getWilaya = catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj

    const wilaya = await Wilaya.findOne({...features , include : [Region]})
    
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `wilaya`,
        data: wilaya
    })
})


/*commune  */

exports.fetchCommune  = catchAsync(async(req , res , next)=>{
    let commune =  req.inst.commune
    commune = await Commune.findByPk(commune.dataValues.commune_id)
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `commune_modified_succefully`,
        data : commune
    })
    
})







exports.deleteCommune  = catchAsync(async(req , res , next)=>{
    const features = new Apifeatures(req.query).filter().queryObj
    await Commune.destroy({...features})

    // client_demand = await ClientDemend.destroy({where :  {client_demand_id}})

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `communes_deleted_succefully`
    })
    
})


exports.getCommunes = catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().queryObj

    const communes = await Commune.findAll({...features})
    
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `communes`,
        data: communes
    })
})

exports.getCommune = catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj

    const commune = await Commune.findOne({...features})
    
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `commune`,
        data: commune
    })
})


/*daira */


exports.getDairas = catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().queryObj

    const dairas = await Daira.findAll({...features})
    
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `dairaas`,
        data: dairas
    })
})





exports.getDaira = catchAsync(async(req, res , next)=>{
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj

    const daira = await Daira.findOne({...features , include : [Region]})
    
    
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `daira`,
        data: daira
    })
})




