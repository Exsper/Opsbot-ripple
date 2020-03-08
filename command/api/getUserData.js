const UserObject = require("./objects/UserObject");


class getUserData {
    async getUserObject(rippleApi, argObject) {
        const rippleUser = await rippleApi.getUsersFull(argObject);
        if (rippleUser.code === "404") return "找不到玩家 " + JSON.stringify(argObject) + "\n";
        if (rippleUser.code === "error") return "获取玩家出错 " + JSON.stringify(argObject) + "\n";
        return new UserObject(rippleUser);
    }

    async outputUser(rippleApi, argObject) {
        let rippleUser = await this.getUserObject(rippleApi, argObject);
        let mode = (argObject.m) ? argObject.m : undefined;
        return rippleUser.toString(mode);
    }

    async getUserIdName(rippleApi, argObject) {
        const rippleUser = await rippleApi.getUsers(argObject);
        if (rippleUser.code === "404") return "找不到玩家 " + JSON.stringify(argObject) + "\n";
        if (rippleUser.code === "error") return "获取玩家出错 " + JSON.stringify(argObject) + "\n";
        const id = rippleUser.id;
        const username = rippleUser.username;
        return {id, username};
    }
}

module.exports = getUserData;