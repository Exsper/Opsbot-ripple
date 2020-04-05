"use strict";

const ScoreObject = require("./objects/ScoreObject");
const RippleApi = require("./RippleApiRequest");
const getUserData = require("./getUserData");

class getBestScoresData {
    constructor(host, apiObjects, isRX) {
        this.host = host;
        this.apiObject = (Array.isArray(apiObjects)) ? apiObjects[0] : apiObjects; // 只允许查一个人
        this.isRX = isRX;
    }

    async getBestScoresObject(simpleUserObject) {
        const result = (this.isRX) ? await RippleApi.getBestsRx(this.apiObject, this.host) : await RippleApi.getBests(this.apiObject, this.host);
        if (result.code === 404) throw "找不到成绩 " + JSON.stringify(this.apiObject);
        if (result.code === 400) throw "必须指定玩家名或Id（或先setid绑定私服账户）";
        if (result.code === "error") throw "获取成绩出错 " + JSON.stringify(this.apiObject);
        let scores = result.scores;
        if ((!Array.isArray(scores)) || (scores.length <= 0)) throw "找不到成绩 " + JSON.stringify(this.apiObject);
        let scoreObjects = scores.map(item => { return new ScoreObject(item, null, simpleUserObject); });
        return scoreObjects;
    }

    async getSimpleUserObject() {
        // 获取simpleUserObject
        let userArgObject = {};
        if (this.apiObject.u) userArgObject.u = this.apiObject.u;
        if (this.apiObject.type) userArgObject.type = this.apiObject.type;
        return await new getUserData(this.host, userArgObject, null).getSimpleUserObject();
    }

    async outputToday() {
        try {
            let today = new Date().getTime();
            let simpleUserObject = await this.getSimpleUserObject();
            // bp列表
            let output = "";
            let scoreObjects = await this.getBestScoresObject(simpleUserObject);
            let todayScoreObjects = scoreObjects.filter((scoreObject) => {
                return (today - scoreObject.getPlayedDate().getTime() < 24 * 3600 * 1000)  
            });
            if (todayScoreObjects.length <= 0) return "您今天还没刷新bp呢（你气不气.wav）";
            let isOver15 = false;
            if (todayScoreObjects.length > 15) {
                isOver15 = true;
                todayScoreObjects = todayScoreObjects.slice(0, 15);
            }
            todayScoreObjects.map((scoreObject) => {
                output = output + scoreObject.beatmap.toScoreTitle(scoreObject.mode);
                output = output + scoreObject.toString() + "\n";
            });
            if (isOver15) output = output + "为防止文字过长，已省略其他bp……"
            return output;
        }
        catch (ex) {
            return ex;
        }
    }

    async output() {
        try {
            let simpleUserObject = await this.getSimpleUserObject();
            if (this.apiObject.limit) {
                // 指定bp
                let scoreObjects = await this.getBestScoresObject(simpleUserObject);
                let limit = parseInt(this.apiObject.limit);
                if (limit > scoreObjects.length || limit <= 0) {
                    if (limit <= 0) return "Ай-ай-ай-ай-ай, что сейчас произошло!";
                    if (limit > 999) return "您要找史前数据吗？";
                    if (limit > 100) return "人家也想看100以外的bp，QAQ";
                    return "超出bp范围，该玩家bp长度为 " + scoreObjects.length;
                }
                let scoreObject = scoreObjects.pop();
                let output = "";
                output = output + scoreObject.beatmap.toScoreTitle(scoreObject.mode);
                output = output + scoreObject.toCompleteString();
                return output;
            }
            else {
                // bp列表
                this.apiObject.limit = "5"; // 设置为bp5，以减轻获取工作
                let scoreObjects = await this.getBestScoresObject(simpleUserObject);
                let output = "";
                scoreObjects.map((scoreObject) => {
                    output = output + scoreObject.beatmap.toScoreTitle(scoreObject.mode);
                    output = output + scoreObject.toString() + "\n";
                });
                return output;
            }
        }
        catch (ex) {
            return ex;
        }
    }
}


module.exports = getBestScoresData;