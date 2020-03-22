const RippleScoreObject = require("./objects/RippleScoreObject");
const getScoreData = require("./getScoreData");


class getRecentScoresData {
    async getRecentScoresObject(rippleApi, argObject, isRelax = false) {
        const result = (isRelax) ? await rippleApi.getRecentRx(argObject) : await rippleApi.getRecent(argObject);
        if (result.code === 404) return "找不到成绩 " + JSON.stringify(argObject) + "\n";
        if (result.code === 400) return "必须指定玩家名或Id（或先绑定私服账户）\n";
        if (result.code === "error") return "获取成绩出错 " + JSON.stringify(argObject) + "\n";
        let scores = result.scores;
        if ((!Array.isArray(scores)) || (scores.length <= 0)) return "找不到成绩 " + JSON.stringify(argObject) + "\n";
        let rippleScoreObjects = scores.map(item => { return new RippleScoreObject(item); });
        return rippleScoreObjects;
    }

    async outputRecentest(rippleApi, argObject) {
        argObject.limit = 1;
        let rippleScoreObjects = await this.getRecentScoresObject(rippleApi, argObject);
        if (typeof rippleScoreObjects === "string") return rippleScoreObjects; // 报错消息

        return await new getScoreData().outputRippleBeatmapAndScoresString(rippleScoreObjects);
    }

    async outputRecentestRx(rippleApi, argObject) {
        argObject.limit = 1;
        let rippleScoreObjects = await this.getRecentScoresObject(rippleApi, argObject, true);
        if (typeof rippleScoreObjects === "string") return rippleScoreObjects; // 报错消息

        return await new getScoreData().outputRippleBeatmapAndScoresString(rippleScoreObjects);
    }


    async getRecentestPassed(rippleApi, argObject) {
        let rippleScoreObjects = await this.getRecentScoresObject(rippleApi, argObject);
        if (typeof rippleScoreObjects === "string") return rippleScoreObjects; // 报错消息
        let hasPassedScore = false;
        for (let i = 0, len = rippleScoreObjects.length; i < len; i++) {
            if (rippleScoreObjects[i].pp !== 0) { // pp===0未pass
                hasPassedScore = true;
                return await new getScoreData().outputRippleBeatmapAndScoresString(rippleScoreObjects[i]);
            }
        }
        if (!hasPassedScore) return "找不到最近的pass成绩";
    }

    async getRecentestPassedRx(rippleApi, argObject) {
        let rippleScoreObjects = await this.getRecentScoresObject(rippleApi, argObject, true);
        if (typeof rippleScoreObjects === "string") return rippleScoreObjects; // 报错消息
        let hasPassedScore = false;
        for (let i = 0, len = rippleScoreObjects.length; i < len; i++) {
            if (rippleScoreObjects[i].pp !== 0) { // pp==="0"未pass
                hasPassedScore = true;
                return await new getScoreData().outputRippleBeatmapAndScoresString(rippleScoreObjects[i]);
            }
        }
        if (!hasPassedScore) return "找不到最近上传的Relax成绩";
    }

}


module.exports = getRecentScoresData;