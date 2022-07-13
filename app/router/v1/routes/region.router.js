const express = require("express");
const {  
    extractToken,protect , 
} = require("../../../controllers/authController");



const {fetchRegion , deleteRegion , getRegions} = require("../../../controllers/regionController")
const {
    initiateRegion
} = require("../../../middlewares/regionMiddleWares")

const {handleSendEmail} = require("../../../middlewares/email")

const router = express.Router();


router.use(extractToken,protect )


router.route("/").get(getRegions)
.post(initiateRegion , fetchRegion)
.put(initiateRegion, fetchRegion)
.delete(deleteRegion)



module.exports = router

