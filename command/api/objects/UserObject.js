const utils = require('../utils');
const ModeStatsObject = require("./ModeStatsObject");

class UserObject {
    constructor(user) {
        this.userId = user.id;
        this.username = user.username;
        this.username_aka = user.username_aka;
        this.modeStats = [];
        this.modeStats[0] = new ModeStatsObject(user.std);
        this.modeStats[1] = new ModeStatsObject(user.taiko);
        this.modeStats[2] = new ModeStatsObject(user.ctb);
        this.modeStats[3] = new ModeStatsObject(user.mania);
        this.favourite_mode = user.favourite_mode;
    }

    toString(mode = this.favourite_mode) {
        let output = "";
        output = output + this.username + " 的 " + utils.getModeString(mode) + " 详细信息：\n";
        output = output + "id：" + this.userId + "\n";
        output = output + this.modeStats[parseInt(mode)].toString();
        return output;
    }
}


module.exports = UserObject;