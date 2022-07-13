const AppError = require("../utils/appError");

const castErrorHandler = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 404);
};

const handleDuplicateFields = (err) => {
    let val = err.errors[0].path
    const message = `Duplicated field value : / ${val} / please use another value`;
    return new AppError(message, 400);
};

const handleDataBaseError = (err) => {
    return new AppError(err.original.message, 400);


}

const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid Input data. ${errors.join(". ")}`;
    console.log(message)
    // return new AppError(message, 400);
};

const handleForeignKeyError = (err) => {
    return (new AppError(err.original.detail, 400))
}

const jwtErrorHandler = () =>
    new AppError("Invalid Token. Please log in again!", 401);

const expiredTokenHandler = () =>
    new AppError("Your Token has expired. Please log in again", 401);

const sendErrorDev = (err, req, res) => {
    console.log("name ", err.name)
    console.error("Error :", err);




    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });

};

const sendErrorProd = (err, req, res) => {
    console.log("name ", err.name)
    console.log(err.code)
    console.error("Error :", err);
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: "error",
            message: "Something went wrong!",
        });
    }
};

module.exports = (err, req, res, next) => {

    let t  = req && req.inst && req.inst.t
    if(t){
        t.rollback()
    }



    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error";

    var error;
    if(err.code === "auth/email-already-exists") error  =  new  AppError('email_already_exist' , 405)
    if(err.code === "auth/argument-error") error  =  new  AppError('id-token-expired' , 401)           
    if(err.code === "auth/id-token-expired") error  =  new  AppError('token' , 401)           
    
    if (err.name === "CastError") error = castErrorHandler(err);
    if (err.name === "SequelizeForeignKeyConstraintError") error = handleForeignKeyError(err);
    if (err.name === "SequelizeUniqueConstraintError") error = handleDuplicateFields(err);
    if (err.name === "SequelizeDatabaseError") error = handleDataBaseError(err)
    // if (err.name === "ValidationError") error = validationErrorHandler(err);
    if (err.name === "JsonWebTokenError") error = jwtErrorHandler();
    if (err.name === "TokenExpiredError") error = expiredTokenHandler();

    sendErrorDev(err, req, res);

    // if (process.env.NODE_ENV === "production") {
    //     sendErrorDev(err, req, res);
    // } else
    //     if (process.env.NODE_ENV === "production") {

    //         console.log(err.name)
    //         console.log(err.code)
           

    //         sendErrorProd(error ? error : err, req, res);
    //     }
};







