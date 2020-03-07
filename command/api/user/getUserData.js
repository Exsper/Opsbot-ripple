const UserObject = require("./UserObject");


class getUserData {
    async getUserObject(osuApi, argObject) {
        const user = await osuApi.getUser(argObject);
        if (user.code === "404") return "找不到玩家 " + JSON.stringify(argObject) + "\n";
        if (user.code === "error") return "获取玩家出错 " + JSON.stringify(argObject) + "\n";
        if (user.length <= 0) return "找不到玩家 " + JSON.stringify(argObject) + "\n";
        return new UserObject(user[0]);
    }

    async outputUser(osuApi, argObject) {
        let userObject = await this.getUserObject(osuApi, argObject);
        return userObject.toString();
    }
}

module.exports = getUserData;