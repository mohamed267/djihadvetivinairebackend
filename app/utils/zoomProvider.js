
const rp = require('request-promise');
const jwt = require('jsonwebtoken');
const {API_KEY , API_SECRET}  =  process.env
const payload = {
    iss: API_KEY,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, API_SECRET);


