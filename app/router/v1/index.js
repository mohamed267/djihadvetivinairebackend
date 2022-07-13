const router = require("express").Router()

const authRouter = require("./routes/auth.router")
const fieldFormRouter = require("./routes/fieldForm.router")
const formRouter = require("./routes/form.router")
const regionRouter = require("./routes/region.router")


router.use('/auth', authRouter)
router.use('/fieldForm', fieldFormRouter)
router.use('/form', formRouter)
router.use('/region', regionRouter)


module.exports = router 