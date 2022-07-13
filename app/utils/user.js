const jwt = require("jsonwebtoken");
const { promisify } = require("util")
const { Op, fn, col } = require("sequelize");
/*models */
const db = require("../server/models/index")
const Pricing = db.pricing
const Enrollement = db.enrollement
const Payment = db.payment
const Receipt = db.receipt
const Account = db.account
const Order = db.order
const Course = db.course
const Session = db.session
const Teacher = db.teacher

module.exports = {
    teacherAccount: async (teacher_id) => {
        let account = await Account.findOne({
            where: {
                "$teacher.id$": { [Op.eq]: teacher_id }
            }
            ,
            include: Teacher
        });
        return account ? account.dataValues : {}
    },

}