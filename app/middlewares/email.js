


const { sendEmail } = require("../utils/nodeMailer");
/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")




exports.handleSendEmail = catchAsync(async (req, res, next) => {
    const {toSend , code , email , text  , template  , subject} = req.inst
    await sendEmail( email, subject  , template ,  {code ,text  } )
    res.status(200).send(toSend)
})