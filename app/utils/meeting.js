const jwt = require("jsonwebtoken");
const { promisify } = require("util")


/* config   */
const rp = require('request-promise');

const { API_KEY, API_SECRET } = process.env
const payload = {
    iss: API_KEY,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, API_SECRET);
const email = "freeclass.app.test@gmail.com";
// const email = "km_rabahsidhoum@esi.dz";
module.exports = {
    createMeeting: async (topic) => {
        var options = {
            method: "POST",
            uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
            body: {
                topic,
                type: 2,
                settings: {
                    host_video: "true",
                    participant_video: "true",
                    join_before_host: true
                }
            },
            auth: {
                bearer: token
            },
            headers: {
                "User-Agent": "Zoom-api-Jwt-Request",
                "content-type": "application/json"
            },
            json: true //Parse the JSON string in the response
        };

        const response = await rp(options);
        return response
    },
    getMeeting: async (id) => {
        var options = {
            method: "POST",
            uri: "https://api.zoom.us/v2/meetings/" + id,
            auth: {
                bearer: token
            },
            headers: {
                "User-Agent": "Zoom-api-Jwt-Request",
                "content-type": "application/json"
            },
            json: true //Parse the JSON string in the response
        };
        const response = await rp(options);
        return response
    },

    createUser: async () => {
        var options = {
            method: "POST",
            uri: "https://api.zoom.us/v2/users",
            body: {
                "action": "create",
                "user_info": {
                    "email": "km_rabahsidhoum@esi.dz",
                    "first_name": "string",
                    "last_name": "string",
                    "password": "pass$$word",
                    "type": 1,
                }
            },
            auth: {
                bearer: token
            },
            headers: {
                "User-Agent": "Zoom-api-Jwt-Request",
                "content-type": "application/json"
            },
            json: true
        };

        const response = await rp(options);
        return response
    }


}