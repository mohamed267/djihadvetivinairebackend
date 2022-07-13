
const { Op } = require("sequelize")



/*error handler  */
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

/*models */
const db = require("../server/models/index")
const Material = db.material
const Files = db.file
const Course = db.course
const GeneralSettings = db.general_setting
const Session = db.session
const Day = db.day
const Grade = db.grade
const Division = db.division
const Year = db.year
const Wilaya = db.wilaya
const Commune = db.commune
const Teacher = db.teacher
const Student = db.student
const Profile = db.profile
const Address = db.address
const Account = db.account
/*tken interceptor */
const { tokenInterceptor } = require('../utils/interceptors')


/*api features */
const Apifeatures = require('../utils/apiFeatures')

exports.getTransactions = catchAsync(async (req, res, next) => {
    const features = new Apifeatures(req.query).filter().queryObj
    const account = await Account.findOne({
        ...features,
        include: [{ model: Teacher }, { model: Student }]
    })

    tokenInterceptor(req, res, next, {
        status: "success",
        message: `teacher statistics`,
        data: account
    })
})



exports.getGeneralInfo = catchAsync(async (req, res, next) => {
    const settings = await GeneralSettings.findByPk(1)
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `general settings`,
        data: settings
    })
});




exports.getLocalAddress = catchAsync(async (req, res, next) => {
    const address = await Address.findOne({ where: { id: 1 } })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `days`,
        data: address
    })
});


exports.getDays = catchAsync(async (req, res, next) => {
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await Day.findAndCountAll({ ...features })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `days`,
        data: {
            count,
            days: rows
        }
    })
});

/*get year grade division */
exports.getGrades = catchAsync(async (req, res, next) => {
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await Grade.findAndCountAll({
        ...features,
        include: Files

    })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `grades`,
        data: {
            count,
            grades: rows
        }
    })
});
exports.getGradesPlain = catchAsync(async (req, res, next) => {
    const grades = await Grade.findAll({
        include: [{
            model: Year,
            include: Division
        }]

    })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `grades`,
        data: grades
    })
});


exports.getYears = catchAsync(async (req, res, next) => {
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await Year.findAndCountAll({
        ...features
        ,
        include: Files
    })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `years`,
        data: {
            count,
            years: rows
        }
    })
});
exports.getDivision = catchAsync(async (req, res, next) => {
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await Division.findAndCountAll({
        ...features
        ,
        include: Files
    })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `divisions`,
        data: {
            count,
            divisions: rows
        }
    })
});

exports.getWilaya = catchAsync(async (req, res, next) => {
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await Wilaya.findAndCountAll({ ...features })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `wilayas`,
        data: {
            count,
            wilayas: rows
        }
    })
});

exports.getCommune = catchAsync(async (req, res, next) => {
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await Commune.findAndCountAll({ ...features })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `communes`,
        data: {
            count,
            communes: rows
        }
    })
});

/*sessions */
exports.getSessions = catchAsync(async (req, res, next) => {
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await Session.findAndCountAll(
        {
            ...features,
            include: [
                {
                    model: Course,
                    include: [
                        {
                            model: Material,
                            include: [
                                { model: Files },
                                {
                                    model: Division,
                                    include: [
                                        { model: Year, include: Grade },
                                    ]
                                },
                                { model: Year, include: Grade },
                            ]
                        }
                    ]
                }
            ]
        })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `sessions`,
        data: {
            count,
            sessions: rows
        }
    })
})
/*get courses */
exports.getCourses = catchAsync(async (req, res, next) => {
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await Course.findAndCountAll(
        {
            ...features,
            include: [
                {
                    model: Material,
                    include: [
                        { model: Files },
                        {
                            model: Division,
                            include: [
                                { model: Year, include: Grade },
                            ]
                        },
                        { model: Year, include: Grade },
                    ]
                }
            ]

        })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `courses`,
        data: {
            count,
            courses: rows
        }
    })
})
/*teacher */


const teacherHandleSearch = (search) => {
    return {
        "$profile.displayName$": { [Op.like]: search }
    }

}

exports.getTeachers = catchAsync(async (req, res, next) => {
    let searchQuery = { [Op.like]: "%%" }
    if (req.query.search) {
        console.log("search is ", req.query.search)
        let search = req.query.search.toLocaleLowerCase()


        console.log("search is an  ", "%" + search + "%")
        searchQuery = { [Op.iLike]: "%" + search + "%" }
    }

    console.log("query is ", req.query)

    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await Teacher.findAndCountAll(
        {
            ...features,
            where: {
                ...features.where,
                [Op.or]: {
                    "$profile.displayName$": searchQuery,
                    "$profile.email$": searchQuery,
                    "$profile.phone_number$": searchQuery,
                    "$profile.commune.name$": searchQuery,
                    "$profile.commune.wilaya.name$": searchQuery,
                }
            },
            include: [
                {
                    model: Profile,
                    include: [
                        {
                            model: Commune,
                            include: {
                                model: Wilaya
                            }
                        },
                        {
                            model: Files,
                            as: "profilePicture"
                        }
                    ]
                }
            ]
        })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `teachers`,
        data: {
            count,
            teachers: rows
        }
    })
})


exports.getTeacher = catchAsync(async (req, res, next) => {
    let { id } = { ...req.params, ...req.inst.teacher }
    const teacher = await Teacher.findByPk(
        id,
        {
            include: [
                {
                    model: Profile,
                    include: {
                        model: Files,
                        as: "profilePicture"
                    }
                },
                {
                    model: Files,
                    as: "presentationVideo"
                }
            ]
        })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `teacher ${id}`,
        data: teacher
    })
})




/*students */
exports.getStudents = catchAsync(async (req, res, next) => {
    let searchQuery = { [Op.like]: "%%" }
    console.log("search is ", req.query.search)
    if (req.query.search) {
        console.log("search is ", req.query.search)
        let search = req.query.search.toLocaleLowerCase()


        console.log("search is an  ", "%" + search + "%")
        searchQuery = { [Op.iLike]: "%" + search + "%" }
    }
    const features = new Apifeatures(req.query).filter().sort().paginate().queryObj
    const { count, rows } = await Student.findAndCountAll(
        {
            ...features,
            where: {
                ...features.where,
                [Op.or]: {
                    "$profile.displayName$": searchQuery,
                    "$profile.email$": searchQuery,
                    "$profile.phone_number$": searchQuery,
                    "$division.name$": searchQuery,
                    "$division.year.name$": searchQuery,
                    "$division.year.grade.name$": searchQuery,
                    "$year.name$": searchQuery,
                    "$year.grade.name$": searchQuery,
                }

            },
            include: [
                {
                    model: Division,
                    include: [
                        { model: Year, include: Grade },
                    ]
                },
                { model: Year, include: Grade },
                {
                    model: Profile,
                    include: {
                        model: Files,
                        as: "profilePicture"
                    }
                }
            ],

        })
    tokenInterceptor(req, res, next, {
        status: "success",
        message: `students`,
        data: {
            count,
            students: rows
        }
    })
})

