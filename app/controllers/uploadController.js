const multer = require("multer");

/*error handler */
const catchAsync = require('../utils/catchAsync');
const appError = require("../utils/appError");
const path = require('path')



function fileFilter(req, file, cb) {

    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted

    // To reject this file pass `false`, like so:
    cb(null, false)

    // To accept the file pass `true`, like so:
    cb(null, true)

    // You can always pass an error if something goes wrong:
    cb(new Error('I don\'t have a clue!'))

}

exports.uploadVideo = (req, res, next, fields, dest) => {
    const storage = multer.diskStorage({
        destination: 'app/public/uploads/' + dest,
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
        }

    })

    const upload = multer({
        storage
    }).fields(fields)
    // const upload = multer({ dest: 'app/public/uploads/' + dest }).fields(fields)
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return (new appError("file does not uploaded", 500));
        } else if (err) {
            return (new appError("file does not uploaded", 500))
        }
        next();
    })


}








exports.singleUpload = (req, res, next, fields, dest) => {

    console.log("we are here files");

    const storage = multer.diskStorage({
        destination: 'app/public/uploads/' + dest,
        filename: function (req, file, cb) {
            console.log("our file is ", file)
            cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
        }

    })

    const upload = multer({
        storage
    }).fields(fields)
    // const upload = multer({ dest: 'app/public/uploads/' + dest }).fields(fields)
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return (new appError("file does not uploaded", 500));
        } else if (err) {
            return (new appError("file does not uploaded", 500))
        }
        next();
    })

}

// const upload = multer({ dest: 'app/public/uploads/' + dest }).fields(fields)
//     upload(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//             return (new appError("file does not uploaded", 500));
//         } else if (err) {
//             return (new appError("file does not uploaded", 500))
//         }
//         next();
//     })






