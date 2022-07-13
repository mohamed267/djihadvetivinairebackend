const jwt = require("jsonwebtoken");
const { promisify } = require("util")
const { Op, fn, col } = require("sequelize");
const moment = require('moment');
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
    depts: async (student_id, account_id) => {
        let account = await Account.findByPk(account_id);
        let { transactions } = account.dataValues
        let actDept = await Enrollement.findAll({
            where: {
                student_id
            },
            include: [{
                model: Pricing,
                required: false,
                right: true
            }]
        })

        let dept = actDept.reduce((prev, curr) => {


            return (prev + curr.dataValues.pricings.reduce((prev2, curr2) => {
                return prev2 + (curr2.remisePrice * curr2.order.dataValues.count)
            }, 0))
            return 0
        }, 0)



        return (dept - transactions)
    },
    pendingPays: async (student_id) => {
        let actPays = await Payment.findAll({
            where: {
                student_id,
                accepted: false,
                refuced: false
            },
        })

        let pays = actPays.reduce((prev, curr) => {
            return (prev + curr.dataValues.amount)
        }, 0)

        return pays
    },
    payments: async (student_id) => {
        return await Payment.findAll({
            where: student_id,
            include: Receipt
        })
    },
    paymentAmount: async (student_id) => {
        const amount = await Payment.findOne({
            where: { student_id, accepted: false  , refuced : false},
            attributes: [[fn('sum', col('amount')), 'total']],
            groupe: ["id"]
        })
        return amount.dataValues.total ? amount.dataValues.total : 0
    },
    payOrders: async (student_id) => {
        const enrols = await Enrollement.findAll({ where: { student_id } })
        const promesses = enrols && enrols.map(async enrol => {
            enrol.set({ accepted: true }) && await enrol.save()
            let { id } = enrol.dataValues
            return await Order.update({ payed: true }, { where: { payed: false, enrollement_id: id } })
        })
        await Promise.all(promesses)
    },
    hanldeRejectPayment: async (student_id) => {
        const enrols = await Enrollement.findAll({
            where: { student_id, accepted: false, expiresAt: { [Op.gte]: new Date() } }
        })
        const promesses = enrols && enrols.map(async enrol => {
            let { session_id, id } = enrol.dataValues
            let order = await Order.findOne({
                where: {
                    payed: false, enrollement_id: id
                }
            })
            let session = await Session.findByPk(session_id)
            await session.increment({ enrollers: -1 })
            if (order.dataValues.count > 1) {
                order.set({ payed: true })
                await order.save()
            }
            await order.increment({ count: -1 })
            enrol.set({ expiresAt: moment() })
            await enrol.save()
        })
        await Promise.all(promesses)
    },
    teacherAccountInfo: async (teacher_id, account_id) => {
        const payments = await Pricing.findAll({
            where: { "$session.course.teacher.id$": { [Op.eq]: teacher_id } },
            include: [
                {
                    model: Session
                    ,
                    include: [
                        {
                            model: Course
                            ,
                            include: [
                                {
                                    model: Teacher
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        let cred = await payments.reduce(async (prev, payment) => {
            const enrollements = await payment.getEnrollements()
            let { price, tax } = payment.dataValues
            let prevPay = await prev
            const cred =
                enrollements.reduce((prevEnrol, enrollement) => {
                    const { count } = enrollement.dataValues.order.dataValues
                    console.log("count ", count, prevEnrol, price, tax, count)
                    console.log("prev gg ", prevEnrol + (price * (100 - tax) / 100) * count)
                    return (prevEnrol + (price * (100 - tax) / 100) * count)
                }, 0)
            return Promise.resolve(prevPay + cred)
        }, Promise.resolve(0))
        let account = await Account.findByPk(account_id);
        let { transactions } = account.dataValues
        return (cred - transactions)
    },
    teacherAccountInfoAll: async (teacher_id, account_id) => {
        const payments = await Pricing.findAll({
            where: { "$session.course.teacher.id$": { [Op.eq]: teacher_id } },
            include: [
                {
                    model: Session
                    ,
                    include: [
                        {
                            model: Course
                            ,
                            include: [
                                {
                                    model: Teacher
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        let cred = await payments.reduce(async (prev, payment) => {
            const enrollements = await payment.getEnrollements()
            let { price, tax } = payment.dataValues
            let prevPay = await prev
            const cred =
                enrollements.reduce((prevEnrol, enrollement) => {
                    const { count } = enrollement.dataValues.order.dataValues
                    return (prevEnrol + (price * count))
                }, 0)
            return Promise.resolve(prevPay + cred)
        }, Promise.resolve(0))
        let account = await Account.findByPk(account_id);
        let { notNetTransactions } = account.dataValues
        return (cred - notNetTransactions)
    }
}