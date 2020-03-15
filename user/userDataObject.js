const getUserData = require("../command/api/getUserData");
const UserObject = require("../command/api/objects/UserObject");

class userDataObject {
    constructor(afterUserObjectJson, beforeUserObjectJson, qqId = "", defaultMode = "0") {
        this.userId = afterUserObject.userId;
        this.userName = afterUserObject.username;
        this.afterUserObject = (afterUserObjectJson) ? new UserObject().init(afterUserObjectJson) : "";
        this.beforeUserObject = (beforeUserObjectJson) ? new UserObject().init(beforeUserObjectJson) : "";
        this.qqId = qqId;
        this.defaultMode = defaultMode;
    }

    toData() {
        return { userId: this.userId, userName: this.userName, qqId:this.qqId, data: JSON.stringify(this) };
    }

    async initUserObject(osuInfo) {
        let userObject = await new getUserData().getUserObject(rippleApi, osuInfo);
        if (typeof userObject === "string") return false; // 报错消息
        this.afterUserObject = userObject;
        this.beforeUserObjectJson = userObject;
        this.defaultMode = osuInfo.m || userObject.favourite_mode;
        return true;
    }

    updateUserObject(newUserObject) {
        // afterUserObject与newUserObject同一天，更新afterUserObject
        if (afterUserObject.toDateString() === newUserObject.toDateString()) this.afterUserObject = newUserObject;
        // afterUserObject与newUserObject不为同一天，冒泡
        else {
            this.beforeUserObject = this.afterUserObject;
            this.afterUserObject = newUserObject;
        }
    }

}

module.exports = userDataObject;