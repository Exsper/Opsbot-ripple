const utils = require('../utils');
const ModeStatsObject = require("./ModeStatsObject");

class UserObject {
    constructor(user) {
        if (user) {
            this.userId = user.id;
            this.username = user.username;
            this.username_aka = user.username_aka;
            this.modeStats = [];
            this.modeStats[0] = new ModeStatsObject(user.std);
            this.modeStats[1] = new ModeStatsObject(user.taiko);
            this.modeStats[2] = new ModeStatsObject(user.ctb);
            this.modeStats[3] = new ModeStatsObject(user.mania);
            this.favourite_mode = user.favourite_mode;

            this.recordDate = new Date();
        }
    }

    init(userObjectJson) {
        this.userId = userObjectJson.userId;
        this.username = userObjectJson.username;
        this.username_aka = userObjectJson.username_aka;
        this.modeStats = [];
        this.modeStats[0] = new ModeStatsObject().init(userObjectJson.modeStats[0]);
        this.modeStats[1] = new ModeStatsObject().init(userObjectJson.modeStats[1]);
        this.modeStats[2] = new ModeStatsObject().init(userObjectJson.modeStats[2]);
        this.modeStats[3] = new ModeStatsObject().init(userObjectJson.modeStats[3]);
        this.favourite_mode = userObjectJson.favourite_mode;

        this.recordDate = userObjectJson.recordDate;
        return this;
    }

    toString(mode = this.favourite_mode) {
        let output = "";
        output = output + this.username + " 的 " + utils.getModeString(mode) + " 详细信息：\n";
        output = output + "id：" + this.userId + "\n";
        output = output + this.modeStats[parseInt(mode)].toString();
        return output;
    }

    /**
     * @param {UserObject} oldUserObject 
     * @param {String|Number} mode 
     */
    tocompareString(oldUserObject, mode = this.favourite_mode) {
        let output = "";
        output = output + this.username + " 的 " + utils.getModeString(mode) + " 详细信息：\n";
        output = output + "id：" + this.userId + "\n";
        output = output + this.modeStats[parseInt(mode)].compareTo(oldUserObject.modeStats[parseInt(mode)]);
        output = output + "\n";
        output = output + "对比：" + oldUserObject.recordDate.toLocaleString();
        return output;
    }
}


module.exports = UserObject;