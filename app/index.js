const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require("path")
const ejs = require('ejs')
const { Sequelize } = require('sequelize');
const app = express()

//template engine set up 
app.set('view engine' ,'html')
app.engine('html' ,  ejs.renderFile)


/*Pubm=lic static folder */

app.use(express.static(__dirname + "/public"))


/*error handler  */

const globalErrorHandler = require("./controllers/errorController");

/*route*/
const router = require('./router/index');






app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const cron = require('node-cron');
const   admin = require("firebase-admin");
const  serviceAccount = require("./config/firebase-config.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});



app.use(cors())
app.options('*', cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/images/users/', express.static(path.join(__dirname, 'public/uploads/users/')));
app.use('/images/works/', express.static(path.join(__dirname, 'public/uploads/works/')));
app.use('/images/accounts/', express.static(path.join(__dirname, 'public/uploads/accounts/')));
app.use('/images/services/', express.static(path.join(__dirname, 'public/uploads/services/')));
app.use('/images/receipts/', express.static(path.join(__dirname, 'public/uploads/receipts/')));
app.use("/images/offers", express.static(path.join(__dirname, 'public/uploads/offers/')));
app.use("/images/demands", express.static(path.join(__dirname, 'public/uploads/demands/')));
app.use("/images/events", express.static(path.join(__dirname, 'public/uploads/events/')));
app.use("/images/ads", express.static(path.join(__dirname, 'public/uploads/ads/')));





app.use(router);


app.use(globalErrorHandler);





module.exports = app;