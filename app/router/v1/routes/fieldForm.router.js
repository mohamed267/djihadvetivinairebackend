const express = require("express");
const {  
    extractToken,protect , 
} = require("../../../controllers/authController");

const {
    fetchFieldForm  , getFieldForms , deleteFieldForm , getFieldForm 
} = require("../../../controllers/fieldFormController")

const {
    handleGroup , initaiteFormField , handleOptions
} = require("../../../middlewares/fieldFormMiddleWares")

const {handleSendEmail} = require("../../../middlewares/email")

const router = express.Router();


router.use(extractToken,protect )


router.route("/").get(getFieldForms)
.post(handleGroup ,initaiteFormField,handleOptions,   fetchFieldForm)
.put(handleGroup ,initaiteFormField,handleOptions,   fetchFieldForm)
.delete(deleteFieldForm)

router.route("/single").get(getFieldForm)



module.exports = router








