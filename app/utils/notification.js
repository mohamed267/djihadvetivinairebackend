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
const Notification = db.notification

module.exports = {
    createNot: async ({ profile_id, type, title, description }) => {
        await Notification.create({ profile_id, type, title, description })
    }
}