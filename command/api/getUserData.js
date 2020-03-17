const UserObject = require("./objects/UserObject");
const UserInfo = require("./UserInfo");


class getUserData {
    async getUserObject(rippleApi, argObject, nedb) {
        const rippleUser = await rippleApi.getUsersFull(argObject);
        if (rippleUser.code === 404) return "找不到玩家 " + JSON.stringify(argObject) + "\n";
        if (rippleUser.code === 400) return "必须指定玩家名或Id（或先绑定私服账户）\n";
        if (rippleUser.code === "error") return "获取玩家出错 " + JSON.stringify(argObject) + "\n";
        let userObject = new UserObject(rippleUser);
        // 存储userObject
        await UserInfo.saveUserObject(nedb, userObject);
        return userObject;
    }

    async outputUser(rippleApi, argObject, nedb) {
        let rippleUser = await this.getUserObject(rippleApi, argObject, nedb);
        if (typeof rippleUser === "string") return rippleUser; // 报错消息
        let mode = (argObject.m) ? argObject.m : undefined;
        // return rippleUser.toString(mode);
        // 从数据库里寻找beforeUserInfo
        let beforeUserInfo = await UserInfo.getBeforeUserObject(nedb, rippleUser.userId);
        return rippleUser.tocompareString(beforeUserInfo, mode);
    }

    async getUserIdName(rippleApi, argObject) {
        const rippleUser = await rippleApi.getUsers(argObject);
        if (rippleUser.code === 404) return "找不到玩家 " + JSON.stringify(argObject) + "\n";
        if (rippleUser.code === "error") return "获取玩家出错 " + JSON.stringify(argObject) + "\n";
        const id = rippleUser.id;
        const username = rippleUser.username;
        return {id, username};
    }
}

module.exports = getUserData;