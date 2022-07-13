/*models */
const db = require("../server/models/index")
const GeneralSetting = db.general_setting


/*utils*/
const moment = require("moment")


module.exports = {
    handleTimeZone: async (time, time_offset_minute) => {
        let mom = moment()
        const setting = await GeneralSetting.findByPk(1)
        let { diff_time_zoneminute } = setting.dataValues
        let [hour, minute] = time.split(":")
        hour = parseInt(hour)
        minute = parseInt(minute)
        let minutes = hour * 60 + minute
        minutes = (minutes + mom.utcOffset() - time_offset_minute + 24 * 60) % (24 * 60)
        minute = minutes % 60;
        hour = Math.floor(minutes / 60)
        return hour + ":" + minute
    },
    handleToTimeZone: async (time, toTime, fromTime) => {
        let [hour, minute] = time.split(":")
        hour = parseInt(hour)
        minute = parseInt(minute)
        let minutes = hour * 60 + minute
        minutes = (minutes + parseInt(toTime) - parseInt(fromTime) + 24 * 60) % (24 * 60)
        minute = minutes % 60;
        hour = Math.floor(minutes / 60)
        return hour + ":" + minute
    },


    getNextInstMont: async (orgTime, day, diff_time_zoneminute) => {
        let [hour, minute] = orgTime.split(":")
        hour = parseInt(hour);
        minute = parseInt(minute)
        var newTime = moment();
        let comparetodate = moment().set({ day, hour, minute, second: 0, millisecond: 0 })
        let weekAdd = 3
        if (newTime.valueOf() > comparetodate.valueOf()) {
            weekAdd = 4
        }



        newTime.
            add(weekAdd * 7, "days").
            set({ day, hour, minute, second: 0, millisecond: 0 })


        return (newTime)
    }


}