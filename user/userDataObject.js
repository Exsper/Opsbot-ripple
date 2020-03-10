const getUserData = require("../command/api/getUserData");
const UserObject = require("../command/api/objects/UserObject");

class userDataObject {
    constructor(oldUserJson, newUserJson, mode = 0) {
        this.qqId = qqId;
        this.oldUserObject = (oldUserJson) ? new UserObject().init(oldUserJson) : "";
        this.newUserObject = (newUserJson) ? new UserObject().init(newUserJson) : "";
        this.mode = mode;
    }

    toData() {
        return { oldUserObject: JSON.stringify(this.oldUserObject), newUserObject: JSON.stringify(this.newUserObject), mode: this.mode };
    }



    
    async updateUserObject(rippleApi, osuInfo) {
        let userObject = await new getUserData().getUserObject(rippleApi, osuInfo);
        if (typeof userObject === "string") return false; // 报错消息
        if (this.oldUserObject === "" && this.newUserObject === "") {
            this.oldUserObject = userObject;
            this.newUserObject = userObject;
            this.mode = osuInfo.m || userObject.favourite_mode;
            return true;
        }
        // userObject与newUserObject同一天，更新newUserObject
        if (userObject.toDateString() === newUserObject.toDateString()) this.newUserObject = userObject;
        // userObject与newUserObject不为同一天
        else {
            this.oldUserObject = this.newUserObject;
            this.newUserObject = userObject;
        }
        return true;
    }

}

module.exports = userDataObject;