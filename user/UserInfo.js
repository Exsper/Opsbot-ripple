const UserObject = require("../command/api/objects/UserObject");
const getUserData = require("../command/api/getUserData");
const utils = require('../command/api/utils');

// 记录内容：
// userId, userName, beforeUserObject, afterUserObject, (qqId), (defaultMode), _Id(db自带)

class UserInfo {
    static async updateToday(nedb, userId, newUserObjectJson) {
        // afterUserObject与newUserObject同一天，更新afterUserObject
        await nedb.update({ userId: userId }, { $set: { afterUserObject: newUserObjectJson } });
    }

    static async setNewDay(nedb, userId, oldUserObjectJson, newUserObjectJson) {
        // afterUserObject与newUserObject不为同一天，冒泡
        await nedb.update({ userId: userId }, { $set: { beforeUserObject: oldUserObjectJson, afterUserObject: newUserObjectJson } });
    }

    static async saveUserObject(nedb, newUserObject) {
        let userId = newUserObject.userId;
        // 查找是否已有记录
        let res = await nedb.findOne({ userId: userId });
        if (res) {
            // 更新userObject
            let afterUserObject = new UserObject().init(res.afterUserObject);
            if (afterUserObject.getDateString() === newUserObject.getDateString()) await this.updateToday(nedb, userId, newUserObject.toJson());
            else await this.setNewDay(nedb, userId, res.afterUserObject, newUserObject.toJson());
        }
        else {
            // 初始化记录
            await nedb.insert({ userId: userId, userName: newUserObject.username, beforeUserObject: newUserObject.toJson(), afterUserObject: newUserObject.toJson() });
        }
    }

    // 获取对比资料
    static async getBeforeUserObject(nedb, userId) {
        let res = await nedb.findOne({ userId: userId });
        if (res) {
            return new UserObject().init(res.beforeUserObject);
        }
        else return undefined;
    }

    // 绑定qqId
    static async bindUser(rippleApi, nedb, qqId, osuInfo) {
        let output = "";
        // 检查是否绑定过
        let res = await nedb.findOne({ qqId: qqId });
        if (res) {
            // 绑定过，删除原来的qqId和defaultMode
            output = output + "警告：您将自动与 " + res.userName + " 解除绑定\n";
            await nedb.update({ qqId: qqId }, { $unset: { qqId: true, defaultMode: true } });
        }
        let userObject = await new getUserData().getUserObject(rippleApi, osuInfo, nedb);
        if (typeof userObject === "string") return userObject; // 报错消息
        // 这时数据库已记录该玩家，添加qqId字段即可
        // 检查该玩家是否已被绑定其他玩家
        let userId = userObject.userId;
        let res2 = await nedb.findOne({ userId: userId });
        if (res2) {
            if (res2.qqId) {
                // 正在绑定其他QQ
                output = output + "警告：自动解除该玩家与QQ " + res2.qqId + " 的绑定\n";
            }
            await nedb.update({ userId: userId }, { $set: { qqId: qqId } });
            output = output + "绑定账号" + userObject.username + "成功";
            if (osuInfo.m) {
                output = output + "，默认模式设置为" + utils.getModeString(osuInfo.m);
                await nedb.update({ userId: userId }, { $set: { defaultMode: osuInfo.m } });
            }
            else await nedb.update({ userId: userId }, { $set: { defaultMode: "0" } });
            return output;
        }
        return output + "数据库出错惹！";
    }

    // 解绑QQ
    static async unbindUser(nedb, qqId) {
        let res = await nedb.findOne({ qqId: qqId });
        if (res) {
            // 绑定过，删除原来的qqId和defaultMode
            await nedb.update({ qqId: qqId }, { $unset: { qqId: true, defaultMode: true } });
            return "与 " + res.userName + " 成功解除绑定";
        }
        else return "您还没有绑定任何账号";
    }

    // 设置默认模式
    static async setMode(nedb, qqId, mode) {
        let defaultMode = utils.getMode(mode);
        let res = await nedb.findOne({ qqId: qqId });
        if (res) {
            // 绑定过，更改原来的defaultMode
            await nedb.update({ qqId: qqId }, { $set: { defaultMode: defaultMode } });
            return "您的默认游戏模式已设置为 " + utils.getModeString(defaultMode);
        }
        else return "您还没有绑定任何账号";
    }

    // 获取绑定账号Id和mod
    static async getUserOsuInfo(qqId, nedb) {
        let res = await nedb.findOne({ qqId: qqId });
        if (res) {
            let defaultMode = res.defaultMode || "";
            return { qqId: qqId, osuId: res.userId, osuName: res.userName, defaultMode: defaultMode };
        }
        else return { qqId: qqId, osuId: -1, osuName: "", defaultMode: "" };
    }
}

module.exports = UserInfo;