const getUserData = require("../command/api/getUserData");
const utils = require('../command/api/utils');

class UserInfo {
    constructor(meta) {
        this.userId = meta.userId;
    }

    async dbInsertUser(nedb, qqId, osuId, osuName, defaultMode) {
        let newDoc = await nedb.insert({ qqId: qqId, osuId: osuId, osuName: osuName, defaultMode: defaultMode });
        if (newDoc) return true;
        else return false;
    }
    async dbRemoveUser(nedb, qqId) {
        let numAffected = await nedb.remove({ qqId: qqId });
        if (numAffected <= 0) return false;
        else {
            if (numAffected > 1) console.log("Warning: 删除了 " + numAffected + " 个 " + qqId + " 的记录")
            return true;
        }
    }
    async dbFindUser(nedb, qqId) {
        let res = await nedb.findOne({ qqId: qqId });
        if (res) return res;
        else return { qqId: qqId, osuId: -1, osuName: "", defaultMode: "" };
    }

    async getOsuIdName(osuApi, osuInfo, mode = "0") {
        let userData = await new getUserData().getUserObject(osuApi, { u: osuInfo, m: mode });
        if (!userData) return null;
        if (typeof userData === 'string') return null;
        let userOsuInfo = {}
        userOsuInfo.osuId = userData.userId;
        userOsuInfo.osuName = userData.username;
        return userOsuInfo;
    }

    async bindUser(osuApi, nedb, qqId, osuInfo, mode = "0") {
        let userData = await this.getOsuIdName(osuApi, osuInfo, mode);
        if (!userData) return "无法获取到 " + osuInfo + " 的信息";
        let bind = await this.dbInsertUser(nedb, qqId, userData.osuId, userData.osuName, mode);
        if (!bind) return "与 " + userData.osuName + " 绑定失败";
        else return "与 " + userData.osuName + " 绑定成功"
    }
    async unbindUser(nedb, qqId) {
        let unbind = this.dbRemoveUser(nedb, qqId);
        if (!unbind) return "解绑失败";
        else return "解绑成功";
    }

    async updateOsuId(osuApi, nedb, qqId, osuInfo, mode = "0") {
        let userData = await this.getOsuIdName(osuApi, osuInfo, mode);
        if (!userData) return "无法获取到 " + osuInfo + " 的信息";
        let numAffected = await nedb.update({ qqId: qqId }, { $set: { osuId: userData.osuId, osuName: userData.osuName } });
        if (numAffected <= 0) return "绑定新账号" + userData.osuName + "失败";
        else {
            if (numAffected > 1) console.log("Warning: 设置了 " + numAffected + " 个 " + qqId + " 的osu账号信息")
            return "绑定新账号" + userData.osuName + "成功";
        }
    }

    async bind(osuApi, nedb, qqId, osuInfo, mode = "0") {
        mode = utils.getMode(mode);
        // 检查原先有没有记录
        let res = await nedb.findOne({ qqId: qqId });
        if (res) {
            // 更新记录
            return await this.updateOsuId(osuApi, nedb, qqId, osuInfo, mode);
        }
        else {
            // 新增记录
            return await this.bindUser(osuApi, nedb, qqId, osuInfo, mode);
        }
    }

    async unbind(nedb, qqId) {
        // 检查原先有没有记录
        let res = await nedb.findOne({ qqId: qqId });
        if (res) {
            // 删除记录
            return await this.unbindUser(nedb, qqId);
        }
        else {
            return "你还没有绑定过osu账号";
        }
    }

    async mode(nedb, qqId, mode) {
        mode = utils.getMode(mode);
        let res = await nedb.findOne({ qqId: qqId });
        if (!res) return "请先绑定osu账号再设置默认游戏模式";
        let numAffected = await nedb.update({ qqId: qqId }, { $set: { defaultMode: mode } });
        if (numAffected <= 0) return "设置默认游戏模式失败";
        else {
            if (numAffected > 1) console.log("Warning: 设置了 " + numAffected + " 个 " + qqId + " 的默认游戏模式")
            return "设置默认游戏模式成功：" + utils.getModeString(mode);
        }
    }


    async getUserOsuInfo(qqId, nedb) {
        let userOsuInfo = await this.dbFindUser(nedb, qqId);
        return new Promise((resolve) => {
            resolve(userOsuInfo);
        });
    }
}

module.exports = UserInfo;