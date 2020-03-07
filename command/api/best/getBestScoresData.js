const ScoreObject = require("../score/ScoreObject");
const getScoreData = require("../score/getScoreData");

class getBestScoresData {
    async getBestScoresObject(osuApi, argObject) {
        const scores = await osuApi.getUserBest(argObject);
        if (scores.code === "404") return "找不到成绩 " + JSON.stringify(argObject) + "\n";
        if (scores.code === "error") return "获取成绩出错 " + JSON.stringify(argObject) + "\n";
        if (scores.length <= 0) return "找不到成绩 " + JSON.stringify(argObject) + "\n";
        let scoreObjects = scores.map(item => { return new ScoreObject(item); });
        return scoreObjects;
    }

    async outputBestList(osuApi, argObject) {
        if (argObject.limit === undefined) argObject.limit = "5"; // 设置为bp5，以减轻获取工作
        let scoreObjects = await this.getBestScoresObject(osuApi, argObject);
        if (typeof scoreObjects === "string") return scoreObjects; // 报错消息

        return await new getScoreData().getAndOutputBeatmapsAndScoresString(osuApi, scoreObjects, argObject);
    }


    async outputBest(osuApi, argObject) {
        // bp几=设置limit参数，取最后一个
        let scoreObjects = await this.getBestScoresObject(osuApi, argObject);
        if (typeof scoreObjects === "string") return scoreObjects; // 报错消息
        if (parseInt(argObject.limit) > scoreObjects.length) return "超出bp范围";
        let scoreObject = scoreObjects.pop();

        return await new getScoreData().getAndOutputBeatmapsAndScoresString(osuApi, scoreObject, argObject);
    }

}


module.exports = getBestScoresData;