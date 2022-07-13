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


exports.handleReservedTime = catchAsync(async (req, res, next) => {
    const { id } = req.inst.teacher
    const resDays = await Day.findAll({})
    let days = resDays.map(el => {
        return { day: el.code, working: el.working }
    })
    const setting = await GeneralSetting.findByPk(1)
    let { time_end_sessions_day, time_begin_sessions_day, session_duration_minute } = setting.dataValues
    const promessExlude = days.map(async el => {
        let day = el.day
        if (!el.working) {
            return ([{ begin: "00:00", end: "23:59" }])
        }
        let exludedTime = []
        const sessions = await Session.findAll({ where: { day, "$course.teacher_id$": id }, include: [{ model: Course }] })
        sessions && sessions.map(sess => {
            let session = sess.dataValues
            let begin = ""
            let end = ""
            let [ubhour, ubmin] = time_begin_sessions_day.split(":")
            ubmin = parseInt(ubmin)
            ubhour = parseInt(ubhour)
            let [bhour, bmin] = session.begin_at.split(":")
            bmin = parseInt(bmin)
            bhour = parseInt(bhour)
            /*caculate déffrents  */
            let diffhour = bhour - ubhour
            let diffmin = diffhour * 60 + bmin - ubmin
            if (diffmin < session_duration_minute) {
                begin = time_begin_sessions_day
            } else {
                begin = session.begin_at
            }

            let [uehour, uemin] = time_end_sessions_day.split(":")
            uemin = parseInt(uemin)
            uehour = parseInt(uehour)
            let ehour = bhour + 2
            let emin = bmin

            /*caculate déffrents  */
            diffhour = uehour - ehour
            diffmin = diffhour * 60 + uemin - emin
            if (diffmin < session_duration_minute) {
                end = time_end_sessions_day
            } else {
                end = ehour + ":" + emin
            }
            exludedTime.push({ begin, end, actual: session })

        })

        return exludedTime

    })

    excluded = await Promise.all(promessExlude)



    req.inst = { ...req.inst, sessionExcluded: excluded }
    next()
})


exports.handlePrivate = catchAsync(async (req, res, next) => {
    let { is_private } = req.body;
    let { take_private_sessions } = req.inst.teacher
    if (is_private && !take_private_sessions) {
        return next(new AppError("you are not allow to add private sessions ", 405))
    }
    next()
})


exports.handlePricingSession = catchAsync(async (req, res, next) => {

    console.log("is a freelancer")
    let { price } = req.inst.teacher

    let { is_freelancer } = req.inst.teacher;
    let { is_private, course_id } = req.body
    // console.log(is_private, course_id)
    const setting = await GeneralSetting.findByPk(1)
    let { session_tax_freelancer, session_tax_teacher, public_session_price } = setting.dataValues
    let course = await Course.findByPk(course_id, { include: Material })
    // console.log(course)
    if (!course) {
        return next(new AppError('there is no course with the associated id', 404))
    }

    let tax = is_freelancer ? session_tax_freelancer : session_tax_teacher
    price = is_private ? (price ? price : req.body.price) : course.dataValues.material.dataValues.price

    req.inst = { ...req.inst, pricing: { tax, price, private: is_private } }


    // console.log(req.inst)

    // let tax = is_freelancer ? session_tax_freelancer : session_tax_teacher
    // console.log(teacherPSPrice)
    // var pricing = await Pricing.create({
    //     name: "public", tax, price: course.dataValues.price
    // })

    // req.inst = { ...req.inst, publicPricing: pricing.dataValues }


    next()
})



exports.canGenerateNewMeeting = catchAsync(async (req, res, next) => {
    let { session_id } = req.query
    let date = new Date()
    let meeting = await Meeting.findOne({
        where: { session_id },
        order: [["updatedAt", "DESC"]]
    })

    if (meeting) {
        let { begin_at } = meeting.dataValues
        begin_at = new Date(begin_at)
        if (begin_at.getTime() > date.getTime()) {
            return next(new AppError("meeting has already  been created ", 400))
        }
    }
    next()
})

exports.restrictSessionOwned = catchAsync(async (req, res, next) => {
    const { id } = req.inst.teacher

    const session = await Session.findOne({ "$course.teacher.id$": { [Op.eq]: id } })
    if (!session) {
        return (next(new AppError("you cannot chage this session ", 400)))
    }
    req.inst = { ...req.inst, session }
    next()
})


exports.restrictToEnrolled = catchAsync(async (req, res, next) => {
    const { session_duration_minute } = await GeneralSetting.findByPk(1)
    let date = moment().add(session_duration_minute, "minutes")
    let student_id = req.inst.student.id
    let { session_id } = req.query
    let enrollement = await Enrollement.findOne({ where: { student_id, session_id } })
    if (!enrollement) {
        return next(new AppError("your are not enrolled to this session ", 401))
    }

    let { expiresAt, updatedAt } = enrollement.dataValues

    expiresAt = moment(expiresAt);


    if (expiresAt.valueOf() < date.valueOf()) {
        return next(new AppError("your enrollement to this session has been expired", 401))
    }

    req.inst = { ...req.inst, intervalEnrol: { begin: updatedAt, end: expiresAt } }

    next()
})


exports.handleInterEnr = catchAsync(async (req, res, next) => {
    const { session_duration_minute } = await GeneralSetting.findByPk(1)
    let date = moment().add(session_duration_minute, "minutes")
    let student_id = req.inst.student.id
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj



    let enrollement = await Enrollement.findOne({ ...features, where: { ...features.where, student_id } })
    if (!enrollement) {
        return next(new AppError("your are not enrolled to this session ", 401))
    }

    let { expiresAt, updatedAt } = enrollement.dataValues

    expiresAt = new Date(expiresAt);
    updatedAt = new Date(updatedAt)

    if (expiresAt.valueOf() < date.valueOf()) {
        return next(new AppError("your enrollement to this session has been expired", 401))
    }

    console.log(expiresAt, updatedAt)

    req.inst = { ...req.inst, intervalEnrol: { begin: updatedAt, end: expiresAt } }

    next()
})





