const express = require("express");
const {  
    extractToken,protect , 
} = require("../../../controllers/authController");

const {
    
} = require("../../../controllers/fieldFormController")


const {fetchForm , deleteForm , getForms} = require("../../../controllers/formController")
const {
    handleFields , initiateform , handleRegion
} = require("../../../middlewares/formMiddleWares")

const {handleSendEmail} = require("../../../middlewares/email")

const router = express.Router();


router.use(extractToken,protect )


router.route("/").get(getForms)
.post(handleFields ,handleRegion,  initiateform , fetchForm)
.put(handleFields ,handleRegion,  initiateform , fetchForm)
.delete(deleteForm)



module.exports = router








