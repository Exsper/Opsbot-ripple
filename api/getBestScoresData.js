"use strict";

const RippleScoreObject = require("./objects/RippleScoreObject");
const getScoreData = require("./getScoreData");

class getBestScoresData {
    async getBestScoresObject(rippleApi, argObject, isRelax = false) {
        const result = (isRelax) ? await rippleApi.getBestsRx(argObject) : await rippleApi.getBests(argObject);
        if (result.code === 404) return "找不到成绩 " + JSON.stringify(argObject) + "\n";
        if (result.code === 400) return "必须指定玩家名或Id（或先绑定私服账户）\n";
        if (result.code === "error") return "获取成绩出错 " + JSON.stringify(argObject) + "\n";
        let scores = result.scores;
        if ((!Array.isArray(scores)) || (scores.length <= 0)) return "找不到成绩 " + JSON.stringify(argObject) + "\n";
        let rippleScoreObjects = scores.map(item => { return new RippleScoreObject(item); });
        return rippleScoreObjects;
    }

    async outputBestList(rippleApi, argObject) {
        if (argObject.limit === undefined) argObject.limit = "5"; // 设置为bp5，以减轻获取工作
        let rippleScoreObjects = await this.getBestScoresObject(rippleApi, argObject);
        if (typeof rippleScoreObjects === "string") return rippleScoreObjects; // 报错消息

        return await new getScoreData().outputRippleBeatmapAndScoresString(rippleScoreObjects);
    }

    async outputBestListRx(rippleApi, argObject) {
        if (argObject.limit === undefined) argObject.limit = "5"; // 设置为bp5，以减轻获取工作
        let rippleScoreObjects = await this.getBestScoresObject(rippleApi, argObject, true);
        if (typeof rippleScoreObjects === "string") return rippleScoreObjects; // 报错消息

        return await new getScoreData().outputRippleBeatmapAndScoresString(rippleScoreObjects);
    }

    async outputBest(rippleApi, argObject) {
        // bp几=设置limit参数，取最后一个
        let rippleScoreObjects = await this.getBestScoresObject(rippleApi, argObject);
        if (typeof rippleScoreObjects === "string") return rippleScoreObjects; // 报错消息
        if (parseInt(argObject.limit) > rippleScoreObjects.length) return "超出bp范围";
        let rippleScoreObject = rippleScoreObjects.pop();

        return await new getScoreData().outputRippleBeatmapAndScoresString(rippleScoreObject);
    }

    async outputBestRx(rippleApi, argObject) {
        // bp几=设置limit参数，取最后一个
        let rippleScoreObjects = await this.getBestScoresObject(rippleApi, argObject, true);
        if (typeof rippleScoreObjects === "string") return rippleScoreObjects; // 报错消息
        if (parseInt(argObject.limit) > rippleScoreObjects.length) return "超出bp范围";
        let rippleScoreObject = rippleScoreObjects.pop();

        return await new getScoreData().outputRippleBeatmapAndScoresString(rippleScoreObject);
    }

}


module.exports = getBestScoresData;