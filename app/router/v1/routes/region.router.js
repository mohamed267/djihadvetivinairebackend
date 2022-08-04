const express = require("express");
const {  
    extractToken,protect , 
} = require("../../../controllers/authController");



const {fetchRegion , deleteRegion , getRegions , getRegion} = require("../../../controllers/regionController")
const {
    initiateRegion , handleWilayas
} = require("../../../middlewares/regionMiddleWares")

const {handleSendEmail} = require("../../../middlewares/email")

const router = express.Router();


router.route("/").get(getRegions)
router.use(extractToken,protect )

router.route("/")
.post(initiateRegion , handleWilayas , fetchRegion)
.put(initiateRegion, handleWilayas , fetchRegion)
.delete(deleteRegion)

router.route("/single").get(getRegion)



module.exports = router

