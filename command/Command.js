"use strict";

// const CommandsInfo = require("./CommandsInfo");
const Arg = require("./Arg");
const UserInfo = require("../user/UserInfo");

const getBeatmapData = require("../api/getBeatmapData");
const getBestScoresData = require("../api/getBestScoresData");
const getRecentScoresData = require("../api/getRecentScoresData");
const getScoreData = require("../api/getScoreData");
const getUserData = require("../api/getUserData");

/**
 * 消息
 * @namespace Command
 * @property {Object} meta
 * @property {String} msg
 */
class Command {
    /**
     * @param {Object} meta koishi Meta
     * @param {Number} meta.userId 发送者qqId
     * @param {String} meta.message 消息
     * @param {Function} meta.$send 发送消息
     * @param {String} host 服务器
     */
    constructor(meta, host = "osu.ppy.sb") {
        this.meta = meta;
        this.host = host;
        /** @type {String} */
        this.msg = (meta.message) ? meta.message.trim().replace(/&#(x)?(\w+);/g, function ($, $1, $2) {
            return String.fromCharCode(parseInt($2, $1 ? 16 : 10));
        }) : "";
        this.commandString = "";
        this.argString = "";
        this.userInfo = { qqId: meta.userId, osuId: -1, osuName: "", defaultMode: "" };
    }

    /**
     * 检查消息前缀，暂只支持单个字母作为前缀
     * @param {String} prefix1
     * @param {String} prefix2
     * @returns {Boolean} 消息是否符合前缀
     */
    cutPrefix(prefix1, prefix2) {
        const msgPrefix = this.msg.substring(0, 1);
        if ((msgPrefix !== prefix1) && (msgPrefix !== prefix2)) return false;
        else {
            this.msg = this.msg.substring(1).trim();
            return true;
        }
    }

    /**
     * 拆出指令和参数，使用前需要先cutPrefix
     * @param {RegExp} commandReg 
     * @returns {Boolean} 消息是否符合指令形式
     */
    cutCommand(commandReg) {
        const mr = commandReg.exec(this.msg);
        if (mr === null) return false;
        else {
            this.commandString = mr[1].toLowerCase();
            this.argString = this.msg.substring(this.commandString.length).trim();
            return true;
        }
    }

    async getUserInfo(nedb) {
        this.userInfo = await UserInfo.getUserOsuInfo(this.meta.userId, nedb);
    }

    getNoArgErrorMessage(argName, argNecessity) {
        let errorMessage = "参数错误：";
        argName = argName.toLowerCase();
        if (argName.indexOf("user") >= 0) errorMessage = errorMessage + "缺少必要参数：玩家名";
        else if (argName.indexOf("beatmap") >= 0) errorMessage = errorMessage + "缺少必要参数：谱面";
        else if (argName.indexOf("mode") >= 0) errorMessage = errorMessage + "缺少必要参数：模式";
        else if (argName.indexOf("limit") >= 0) errorMessage = errorMessage + "缺少必要参数：索引";
        else if (argName.indexOf("mods") >= 0) errorMessage = errorMessage + "缺少必要参数：mod";
        if (argNecessity === 1) errorMessage = errorMessage + "，您也可以用setid绑定您的ppysb账号";
        return errorMessage;
    }

    /**
     * 分析argString
     * @param {Object} commandInfo 
     * @param {Object} regs 
     * @param {nedb} nedb 
     * @returns {Promise<Arg>}
     */
    async getArgObject(commandInfo, regs, nedb) {
        let args = {};
        /**@type {Array<String>} */
        let argsName = commandInfo.args;
        /**@type {Array<-1|0|1>}  2：必须直接提供 1：user，必须提供，省略时从存储中寻找 0：mods，可省略，省略时从存储中寻找，如果找不到则省略 -1：可省略 */
        let argNecessity = commandInfo.argNecessity;
        // 该指令不需要任何参数（并不是消息中没有参数）
        if (argsName.length <= 0) return new Arg(args); // getOsuApiObject = [{}]
        // 如果有需要从数据库获取的参数，先去获取
        if (argNecessity.indexOf(0) >= 0 || commandInfo.type === "api_score_me" || commandInfo.type === "api_score_me_rx") await this.getUserInfo(nedb);
        // me指令没有userId参数，默认是绑定账号，只为了兼容白菜指令，不要它代码会更简洁一点
        if (commandInfo.type === "api_score_me" || commandInfo.type === "api_score_me_rx") args.userStringWithoutBeatmap = this.userInfo.osuId;
        argsName.map((argName, index) => {
            let ar = regs[argName].exec(this.argString);
            if (ar === null) {
                // 没匹配到该参数
                if (argNecessity[index] === 2) throw this.getNoArgErrorMessage(argsName[index], 2);
                else if (argNecessity[index] === 1) {
                    if (argsName[index] === "userStringWithoutBeatmap" && this.userInfo.osuId > 0) args.userStringWithoutBeatmap = this.userInfo.osuId;
                    else if (argsName[index] === "userStringWithBeatmap" && this.userInfo.osuId > 0) args.userStringWithBeatmap = this.userInfo.osuId;
                    else if (argsName[index] === "modeString" && this.userInfo.defaultMode) args.modeString = this.userInfo.defaultMode;
                    else if (argsName[index] === "onlyModeString" && this.userInfo.defaultMode) args.onlyModeString = this.userInfo.defaultMode;
                    else throw this.getNoArgErrorMessage(argsName[index], 1);
                }
            }
            else {
                args[argName] = ar[1];
            }
        });
        return new Arg(args);
    }


    getHelp(commands) {
        let output = ""
        if (!this.argString) {
            output = output + "osu.ppy.sb 专用查询\n";
            output = output + "呜哇，好多不想写，反正就和白菜差不多嘛\n";
            output = output + "查relax模式就在指令后加rx\n";
            output = output + "基本指令有：" + commands.reduce((acc, cur) => { return acc + cur.command[0] + "/" }, "");
            return output;
        }
        // 查找指令
        for (let com of commands) {
            if (com.command.includes(this.argString)) {
                output = output + commands.info + "\n";
                output = output + "指令：" + commands.command.join("/") + "\n";
                output = output + "参数：" + commands.argsInfo;
                return output;
            }
        }
        return "没有 " + this.argString + " 这个指令呢";
    }

    /**
     * 运行指令
     * @param {CommandsInfo} commandsInfo 
     * @param {nedb} nedb 
     */
    async execute(commandsInfo, nedb) {
        if (!this.cutPrefix(commandsInfo.prefix, commandsInfo.prefix2)) return ""; // 非指定前缀
        if (!this.cutCommand(commandsInfo.commandReg)) return ""; // 指令格式不正确
        // 帮助
        if (this.commandString === "help") {
            return this.getHelp();
        }
        // 查找指令
        const commands = commandsInfo.commands;
        for (let com of commands) {
            if (com.command.includes(this.commandString)) {
                let arg = await this.getArgObject(com, commandsInfo.regs, nedb);
                let type = com.type;
                switch (type) {
                    case 'api_beatmap': return await this.getApiBeatmapInfo(arg);
                    case 'api_user': return await this.getApiUserInfo(arg, false, nedb);
                    case 'api_user_rx': return await this.getApiUserInfo(arg, true, nedb);
                    case 'api_score': 
                    case 'api_score_me': return await this.getApiScoreInfo(arg, false, false, false);
                    case 'api_score_rx':
                    case 'api_score_me_rx': return await this.getApiScoreInfo(arg, true, false, false);
                    case 'api_score_top': return await this.getApiScoreInfo(arg, false, true, false);
                    case 'api_score_top_rx': return await this.getApiScoreInfo(arg, true, true, false);
                    case 'api_score_vstop': return await this.getApiScoreInfo(arg, false, false, true);
                    case 'api_score_vstop_rx': return await this.getApiScoreInfo(arg, true, false, true);
                    case 'api_bp': return this.getApiBpInfo(arg, false);
                    case 'api_bp_rx': return this.getApiBpInfo(arg, true);
                    case 'api_recent': return this.getApiRecentInfo(arg, false, false);
                    case 'api_recent_rx': return this.getApiRecentInfo(arg, true, false);
                    case 'api_recent_passed': return this.getApiRecentInfo(arg, false, true);
                    case 'api_recent_passed_rx': return this.getApiRecentInfo(arg, true, true);
                    case 'bot_bind': return this.getBotBindInfo(arg, nedb);
                    case 'bot_unbind': return this.getBotUnbindInfo(nedb);
                    case 'bot_setmode': return this.getBotSetmodeInfo(arg, nedb);
                    default: return "当你看到这条信息说明指令处理代码有bug惹";
                }
            }
        }
        return ""; // 找不到该指令
    }

    async getApiBeatmapInfo(arg) {
        let apiObjects = await arg.getBeatmapId().getOsuApiObject();
        return await new getBeatmapData(this.host, apiObjects).output();
    }

    async getApiUserInfo(arg, isRX, nedb) {
        let apiObjects = arg.getOsuApiObject();
        return await new getUserData(this.host, apiObjects, isRX).output(nedb);
    }

    async getApiScoreInfo(arg, isRX, isTop, isVsTop) {
        let apiObjects = await arg.getBeatmapId().getOsuApiObject();
        return await new getScoreData(this.host, apiObjects, isRX, isTop, isVsTop).output();
    }

    async getApiBpInfo(arg, isRX) {
        let apiObjects = arg.getOsuApiObject();
        return await new getBestScoresData(this.host, apiObjects, isRX).output();
    }

    async getApiRecentInfo(arg, isRX, isPassed) {
        let apiObjects = arg.getOsuApiObject();
        return await new getRecentScoresData(this.host, apiObjects, isRX, isPassed).output();
    }

    async getBotBindInfo(arg, nedb) {
        let apiObjects = arg.getOsuApiObject();
        return await new UserInfo(this.host).bindUser(nedb, this.meta.userId, apiObjects[0]);
    }

    async getBotUnbindInfo(nedb) {
        return await new UserInfo(this.host).unbindUser(nedb, this.meta.userId);
    }

    async getBotSetmodeInfo(arg, nedb) {
        let apiObjects = arg.getOsuApiObject();
        return await new UserInfo(this.host).setMode(nedb, this.meta.userId, apiObjects[0].m);
    }
}

module.exports = Command;