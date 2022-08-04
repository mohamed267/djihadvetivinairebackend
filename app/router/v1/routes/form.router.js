const express = require("express");
const {  
    extractToken,protect , 
} = require("../../../controllers/authController");

const {
    
} = require("../../../controllers/fieldFormController")


const {fetchForm , deleteForm , getForms , getForm} = require("../../../controllers/formController")
const {
    handleFields , initiateform , handleRegion
} = require("../../../middlewares/formMiddleWares")

const {handleSendEmail} = require("../../../middlewares/email")

const router = express.Router();

router.route("/").get(getForms)
router.route("/single").get(getForm)

router.use(extractToken,protect )

router.route("/")
.post(handleFields ,handleRegion,  initiateform , fetchForm)
.put(handleFields ,handleRegion,  initiateform , fetchForm)
.delete(deleteForm)


module.exports = router








