
const moment = require("moment")
const { Op } = require("sequelize");
/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

/*models */
const db = require("../server/models/index")
const Course = db.course
const Files = db.file

const Teacher = db.teacher
const InstanceCourse = db.instanceCourse
const Session = db.session
const Remise = db.remise
const GeneralSetting = db.general_setting
const Pricing = db.pricing
const Material = db.material
const Enrollement = db.enrollement
const Meeting = db.meeting
const Day = db.day
/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')


/*api features */
const Apifeatures = require('../utils/apiFeatures')

exports.handleRemise = catchAsync(async (req, res, next) => {
    const { id } = req.inst.student
    let { is_remise, session_id } = req.body;
    if (is_remise) {
        let session = session_id && await Session.findByPk(session_id)
        if (!session) {
            return (next(new AppError("there is no session", 404)))
        }
        let course = session.dataValues.course_id && await Course.findByPk(session.dataValues.course_id)
        if (!course) {
            return (next(new AppError("there is no course", 404)))
        }
        let material = course.dataValues.material_id && await Material.findByPk(course.dataValues.material_id)
        if (!material) {
            return (next(new AppError("there is no material", 404)))
        }


        const remise = await Remise.findOne({
            where: {
                id,
                [Op.or]: {
                    expiresAt: { [Op.gt]: new Date() },
                    expires: { [Op.not]: true }
                },
                count: { [Op.gt]: 0 }
            }
        })


        if (
            (!remise || remise.dataValues.material_group_id !== material.material_group_id)
        ) {
            return (next(new AppError("cannot discount this course ", 403)))
        }
        req.inst = { ...req.inst, remise: remise.dataValues }
    }

    next()
})