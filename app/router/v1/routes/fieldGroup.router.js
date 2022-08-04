const express = require("express");
const {  
    extractToken,protect , 
} = require("../../../controllers/authController");

const {
    fetchFieldGroup  , getFieldGroups , deleteFieldGroup , getFieldGroup 
} = require("../../../controllers/fieldGroupController")

const {
     initaiteFieldGroup 
} = require("../../../middlewares/fieldGroupMiddleWares")

const {handleSendEmail} = require("../../../middlewares/email")

const router = express.Router();


router.use(extractToken,protect )


router.route("/").get(getFieldGroups)
.post(  initaiteFieldGroup ,  fetchFieldGroup)
.put(initaiteFieldGroup,  fetchFieldGroup)
.delete(deleteFieldGroup)

router.route("/single").get(getFieldGroup)



module.exports = router








