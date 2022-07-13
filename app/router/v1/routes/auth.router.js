const express = require("express");
const {  
    extractToken,protect , 
    loginAdmin , createAdmin,changePasswordKnown,
    
    
    
} = require("../../../controllers/authController");
const {handleSendEmail} = require("../../../middlewares/email")

const router = express.Router();


router.route("/login/admin").post(loginAdmin);

// router.use(extractToken,protect)

router.route("/admin/new").post(createAdmin)
router.route("/admin/password/known").patch(changePasswordKnown)


module.exports = router








