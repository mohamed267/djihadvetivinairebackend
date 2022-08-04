const router = require("express").Router()

const authRouter = require("./routes/auth.router")
const fieldFormRouter = require("./routes/fieldForm.router")
const formRouter = require("./routes/form.router")
const regionRouter = require("./routes/region.router")
const addressRouter = require("./routes/address.router")
const fieldGroupRouter = require("./routes/fieldGroup.router")

router.use('/auth', authRouter)
router.use('/form_field', fieldFormRouter)
router.use('/field_group', fieldGroupRouter)
router.use('/form', formRouter)
router.use('/region', regionRouter)
router.use('/address', addressRouter)


module.exports = router 