const functions = require("firebase-functions");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { param } = require("../app");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



admin.initializeApp()

exports.inboundSMS =  functions.https.onRequest(async (req ,  res)=>{
    let params ;
    if(Object.keys(req.query).length === 0){
        params =  req.body
    } else{
        param = req.query
    }
    await admin.database().ref('/msgq').push(params);
    res.sendStatus(200)
})