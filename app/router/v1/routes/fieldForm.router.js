const express = require("express");
const {  
    extractToken,protect , 
} = require("../../../controllers/authController");

const {
    fetchFieldForm  , getFieldForm , deleteFieldForm 
} = require("../../../controllers/fieldFormController")

const {
    handleGroup , initaiteFormField , handleOptions
} = require("../../../middlewares/fieldFormMiddleWares")

const {handleSendEmail} = require("../../../middlewares/email")

const router = express.Router();


router.use(extractToken,protect )


router.route("/").get(getFieldForm)
.post(handleGroup ,initaiteFormField,handleOptions,   fetchFieldForm)
.put(handleGroup ,initaiteFormField,handleOptions,   fetchFieldForm)
.delete(deleteFieldForm)



module.exports = router








