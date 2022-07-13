const routerV1 = require("./v1/index")
const router = require("express").Router()

router.use("/v1", routerV1)


module.exports = router 