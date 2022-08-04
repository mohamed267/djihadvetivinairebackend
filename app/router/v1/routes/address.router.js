const express = require("express");
const {  
    extractToken,protect , 
} = require("../../../controllers/authController");


const {fetchWilaya , deleteWilaya , getWilayas , getWilaya,
    createWilayas,
    fetchCommune , deleteCommune , getCommunes , getCommune , getWilayaRegions ,
    getDaira , getDairas
} =   require("../../../controllers/addressController")
// const {fetchRegion , deleteRegion , getRegions , getRegion} = require("../../../controllers/regionController")
const {
    initiateWilaya , initiateCommune
} = require("../../../middlewares/addressMiddleWares")

const {handleSendEmail} = require("../../../middlewares/email")

const router = express.Router();


router.use(extractToken,protect )

/*wilaya */
router.route("/wilaya/all").post(createWilayas)
router.route("/wilaya").get(getWilayas)
.post(initiateWilaya , fetchWilaya)
.put(initiateWilaya , fetchWilaya)
.delete(deleteWilaya)
router.route('/daira').get(getDairas)

router.route("/wilaya/region").get(getWilayaRegions)

router.route("/wilaya/single").get(getWilaya)
router.route("/daira/single").get(getDaira )
/*commune */

router.route("/commune").get(getCommunes)
.post(initiateCommune , fetchCommune)
.put(initiateCommune , fetchCommune)
.delete(deleteCommune)

router.route("/commune/single").get(getCommune)



module.exports = router

