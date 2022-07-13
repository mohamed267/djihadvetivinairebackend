const jwt = require("jsonwebtoken");
const { promisify } = require("util")



module.exports = {
    signJwt: (admin) => {
        return jwt.sign({ id: admin.admin_id, type: admin.type , verified : admin.verified }
            , process.env.JWT_SECRET,
            // {
            //     expiresIn: process.env.JWT_EXPIRES,

            // }
        );
    },
    signRefreshJwt: (admin) => {
        return jwt.sign({ id: admin.admin_id, type: admin.type }
            , process.env.JWT_REFRESH_SECRET,
            // {
            //     expiresIn: process.env.JWT_REFRESH_EXPIRES,

            // }
        );
    },
    verify: (token) => {
        return (
            promisify(jwt.verify)(token, process.env.JWT_SECRET)
        )
    },
    verify_refresh_token: (token) => {
        return (
            promisify(jwt.verify)(token, process.env.JWT_REFRESH_SECRET)
        )
    }


}