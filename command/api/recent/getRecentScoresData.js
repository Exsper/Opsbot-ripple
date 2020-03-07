const ScoreObject = require("../score/ScoreObject");
const getScoreData = require("../score/getScoreData");


class getRecentScoresData {
    async getRecentScoreObject(osuApi, argObject, isRelax = false) {
        const scores = (isRelax) ? await osuApi.getUserRecentRx(argObject) : await osuApi.getUserRecent(argObject);
        if (scores.code === "404") return "找不到成绩 " + JSON.stringify(argObject) + "\n";
        if (scores.code === "error") return "获取成绩出错 " + JSON.stringify(argObject) + "\n";
        if (scores.length <= 0) return "找不到成绩 " + JSON.stringify(argObject) + "\n";
        let scoreObjects = scores.map(item => { return new ScoreObject(item); });
        return scoreObjects;
    }

    async outputRecentest(osuApi, argObject) {
        argObject.limit = 1;
        let scoreObjects = await this.getRecentScoreObject(osuApi, argObject);
        if (typeof scoreObjects === "string") return scoreObjects; // 报错消息

        return await new getScoreData().getAndOutputBeatmapAndScoresString(osuApi, scoreObjects, argObject);
    }

    async outputRecentestRx(osuApi, argObject) {
        argObject.limit = 1;
        let scoreObjects = await this.getRecentScoreObject(osuApi, argObject, true);
        if (typeof scoreObjects === "string") return scoreObjects; // 报错消息

        return await new getScoreData().getAndOutputBeatmapAndScoresString(osuApi, scoreObjects, argObject);
    }


    async getRecentestPassed(osuApi, argObject) {
        let scoreObjects = await this.getRecentScoreObject(osuApi, argObject);
        if (typeof scoreObjects === "string") return scoreObjects; // 报错消息
        let hasPassedScore = false;
        for (let i = 0, len = scoreObjects.length; i < len; i++) {
            if (scoreObjects[i].pp !== "0") { // pp==="0"未pass
                hasPassedScore = true;
                return await new getScoreData().getAndOutputBeatmapAndScoresString(osuApi, scoreObjects[i], argObject);
            }
        }
        if (!hasPassedScore) return "找不到最近的pass成绩";
    }

    async getRecentestPassedRx(osuApi, argObject) {
        let scoreObjects = await this.getRecentScoreObject(osuApi, argObject, true);
        if (typeof scoreObjects === "string") return scoreObjects; // 报错消息
        let hasPassedScore = false;
        for (let i = 0, len = scoreObjects.length; i < len; i++) {
            if (scoreObjects[i].pp !== "0") { // pp==="0"未pass
                hasPassedScore = true;
                return await new getScoreData().getAndOutputBeatmapAndScoresString(osuApi, scoreObjects[i], argObject);
            }
        }
        if (!hasPassedScore) return "找不到最近上传的Relax成绩";
    }

}


module.exports = getRecentScoresData;