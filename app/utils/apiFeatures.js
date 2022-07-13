const { Op } = require("sequelize");

const handleStringToObg = (str) => {
    return (typeof (str) !== "string" ? str :
        (handleStringToObg(JSON.parse(str))
        )
    )
}

class Apifeatures {
    constructor(req) {
        this.req = req
        this.queryObj = {}
    }



    filter() {
        // //normal filter
        let instanseReq = { ...this.req }
        const exludedFields = ["services" ,  "page", "sort", "limit", "fields", "select", "intervaltime", "search"];
        exludedFields.forEach(field => delete instanseReq[field]);
        // //filtering > and >= < <=
        let globFilt = {}

        Object.keys(instanseReq).map(field => {
            let elFilt = handleStringToObg(instanseReq[field]);
            console
            let objfilt = {};
            if (elFilt) {
                if (elFilt.lt || elFilt.lt===null) {
                    objfilt = { ...objfilt, [Op.lt]: elFilt.lt }
                }
                if (elFilt.lte || elFilt.lte===null) {
                    objfilt = { ...objfilt, [Op.lte]: elFilt.lte }
                }
                if (elFilt.gt || elFilt.gt===null) {
                    objfilt = { ...objfilt, [Op.gt]: elFilt.gt }
                }
                if (elFilt.gte || elFilt.gte===null) {
                    objfilt = { ...objfilt, [Op.gte]: elFilt.gte }
                }
                if (elFilt.eq || elFilt.eq===null) {
                    console.log("conn ",elFilt.eq )
                    objfilt = { ...objfilt, [Op.eq]: elFilt.eq }
                }
                if (elFilt.or  || elFilt.or===null) {
                    objfilt = { ...objfilt, [Op.or]: elFilt.or }
                }
                if (elFilt.not  || elFilt.not===null) {
                    objfilt = { ...objfilt, [Op.not]: elFilt.not }
                }
                if (elFilt.like   || elFilt.like===null) {
                    objfilt = { ...objfilt, [Op.like]: "%" + elFilt.like + "%" }
                }
            }
            console.log("ong filt ", objfilt)
            globFilt[field] = objfilt

        })
        this.queryObj = { ...this.queryObj, where: globFilt }
        return this
    }
    sort() {
        if (this.req.sort) {
            this.queryObj = { ...this.queryObj, order: [JSON.parse(this.req.sort)] }
        } else {
            this.queryObj = { ...this.queryObj, order: [["createdAt", "DESC"]] }
        }
        return this
    }

    select() {
        console.log(this.req.select)
        if (this.req.select) {
            this.queryObj = { ...this.queryObj, attributes: JSON.parse(this.req.select) }
        }
        return this
    }
    paginate() {
        let page = this.req.page * 1 || 1
        let limit = this.req.limit * 1 || 100
        let offset = (page - 1) * limit
        this.queryObj = { ...this.queryObj, limit, offset }
        return this
    }

}
module.exports = Apifeatures