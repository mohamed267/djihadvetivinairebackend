/**/

const { Op } = require("sequelize")


/*error handler  */
const catchAsync = require("../utils/catchAsync")

/*models */


const db = require("../server/models/index")
const GeneralSetting = db.general_setting
const Enrollement = db.enrollement
const TeacherPayment = db.teacher_payment
const Session = db.session
const Teacher = db.teacher
/*utils*/
const moment = require("moment")
const { teacherAccountInfo, teacherAccountInfoAll } = require("../utils/payment")

module.exports = {
    handleEnrollements: catchAsync(async () => {
        const enrollementsExpires = await Enrollement.findAll(
            {
                where: {
                    expiresAt: { [Op.lt]: new Date() },
                    accepted: true
                }
            }
        )


        enrollementsExpires.map(async el => {
            el.set({ accepted: false })
            await el.save()
            let session = await Session.findByPk(el.dataValues.session_id)
            await session.increment({ enrollers: -1 })
        })
    }),
    handleTeacherPayment: catchAsync(async () => {
        let dayToPay = moment().date()
        const teachers = await Teacher.findAll({ where: { dayToPay } })
        await Promise.all(teachers.map(async teacher => {
            const { id, account_id, ccp, key, createdAt } = teacher.dataValues
            const amount = await teacherAccountInfo(id, account_id)
            const allAmmount = await teacherAccountInfoAll(id, account_id)
            if (amount > 0) {

                await TeacherPayment.create({ amount, notNetAmount: allAmmount, ccp, key, teacher_id: id })
              
            }
        }))


    }),


}