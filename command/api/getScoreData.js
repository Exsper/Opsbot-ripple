const ScoreObject = require("./objects/ScoreObject");
const getBeatmapData = require("./getBeatmapData");
const utils = require('./utils');


class getScoreData {
    async getScoreObjects(osuApi, argObject) {
        const scores = await osuApi.getScores(argObject);
        if (scores.code === 404) return "找不到成绩 " + JSON.stringify(argObject) + "\n";
        if (scores.code === "error") return "获取成绩出错 " + JSON.stringify(argObject) + "\n";
        if (scores.length <= 0) return "找不到成绩 " + JSON.stringify(argObject) + "\n";
        let scoreObjects = scores.map(item => { return new ScoreObject(item); });
        return scoreObjects;
    }

    async getOneScoreBeatmapData(osuApi, scoreObject, argObject) {
        // 获取beatmapObject
        let beatmapArgObject = {};
        if (scoreObject.beatmap_id) beatmapArgObject.b = scoreObject.beatmap_id;
        else if (argObject.b) beatmapArgObject.b = argObject.b;
        if (argObject.m) beatmapArgObject.m = argObject.m;
        if (argObject.a) beatmapArgObject.a = argObject.a;
        // 获取acc
        if (beatmapArgObject.b) {
            const beatmapObject = await new getBeatmapData().getBeatmapObject(osuApi, beatmapArgObject);
            if (typeof beatmapObject === "string") return { scoreObject: scoreObject, beatmapObject: null }; // 报错消息
            if (beatmapArgObject.m) scoreObject.addMode(beatmapArgObject.m);
            return { scoreObject: scoreObject, beatmapObject: beatmapObject };
        }
        else return { scoreObject: scoreObject, beatmapObject: null };
    }

    async getScoreBeatmapData(osuApi, scoreObjects, argObject) {
        // 获取beatmapObject
        let beatmapArgObject = {};
        if (scoreObjects[0].beatmap_id) beatmapArgObject.b = scoreObjects[0].beatmap_id;
        else if (argObject.b) beatmapArgObject.b = argObject.b;
        if (argObject.m) beatmapArgObject.m = argObject.m;
        if (argObject.a) beatmapArgObject.a = argObject.a;
        // 获取acc
        if (beatmapArgObject.b) {
            const beatmapObject = await new getBeatmapData().getBeatmapObject(osuApi, beatmapArgObject);
            if (typeof beatmapObject === "string") return { scoreObjects: scoreObjects, beatmapObject: null }; // 报错消息
            for (let i = 0, len = scoreObjects.length; i < len; i++) {
                if (beatmapArgObject.m) scoreObjects[i].addMode(beatmapArgObject.m);
                scoreObjects[i].addAcc(beatmapObject);
            }
            return { scoreObjects: scoreObjects, beatmapObject: beatmapObject };
        }
        else return { scoreObjects: scoreObjects, beatmapObject: null };
    }

    outputBeatmapAndScoresString(scoreObjects, beatmapObject) {
        let output = "";
        if (beatmapObject) {
            if (scoreObjects[0].mode > 0) output = output + beatmapObject.toScoreTitle(utils.getModeString(scoreObjects[0].mode));
            else output = output + beatmapObject.toScoreTitle();
        }
        for (let i = 0, len = scoreObjects.length; i < len; i++) {
            output = output + scoreObjects[i].toString();
        }
        return output;
    }

    async getAndOutputBeatmapAndScoresString(osuApi, scoreObjects, argObject) {
        let so = [];
        if (Array.isArray(scoreObjects)) so = scoreObjects;
        else {
            so.push(scoreObjects);
        }

        const scoreBeatmapData = await this.getScoreBeatmapData(osuApi, so, argObject);
        so = scoreBeatmapData.scoreObjects;
        const beatmapObject = scoreBeatmapData.beatmapObject;
        return this.outputBeatmapAndScoresString(so, beatmapObject);
    }

    async getAndOutputBeatmapsAndScoresString(osuApi, scoreObjects, argObject) {
        let output = "";
        if (Array.isArray(scoreObjects)) {
            for (let i = 0, len = scoreObjects.length; i < len; i++) {
                output = output + await this.getAndOutputBeatmapAndScoresString(osuApi, scoreObjects[i], argObject);
            }
        }
        else {
            output = output + await this.getAndOutputBeatmapAndScoresString(osuApi, scoreObjects, argObject);
        }
        return output;
    }


    async outputScores(osuApi, argObjects) {
        // 用argObjects兼容多个成绩比较
        let scoreObjects = [];
        for (let i = 0, len = argObjects.length; i < len; i++) {
            let items = await this.getScoreObjects(osuApi, argObjects[i]);
            if (typeof items !== "string") scoreObjects = scoreObjects.concat(items);
        }
        if (scoreObjects.length <= 0) return "找不到成绩" + JSON.stringify(argObjects) + "\n";

        return await this.getAndOutputBeatmapAndScoresString(osuApi, scoreObjects, argObjects[0]);
    }

    async outputTopScore(osuApi, argObject) {
        // limit = 1 即为最高pp
        let argObjects = [];
        argObject.limit = 1;
        argObjects.push(argObject);
        return await this.outputScores(osuApi, argObjects);
    }


    async outputVsTopScore(osuApi, argObject) {
        let scoreObjects = [];
        const yourScoreObjects = await this.getScoreObjects(osuApi, argObject);
        if (typeof yourScoreObjects === "string") return yourScoreObjects; // 报错消息
        scoreObjects.push(yourScoreObjects[0]);
        let yourPP = yourScoreObjects[0].pp;
        let yourName = yourScoreObjects[0].username;

        let topArgObject = argObject;
        topArgObject.limit = 1;
        delete topArgObject.u;
        const topScoreObjects = await this.getScoreObject(osuApi, topArgObject);
        if (typeof topScoreObjects === "string") return topScoreObjects; // 报错消息
        scoreObjects.push(topScoreObjects[0]);
        let topPP = topScoreObjects[0].pp;
        let topName = topScoreObjects[0].username;

        const scoreBeatmapData = await this.getScoreBeatmapData(osuApi, scoreObjects, argObject);
        scoreObjects = scoreBeatmapData.scoreObjects;
        const beatmapObject = scoreBeatmapData.beatmapObject;

        let output = "";
        if (beatmapObject) {
            if (scoreObjects[0].mode > 0) output = output + beatmapObject.toScoreTitle(utils.getModeString(scoreObjects[0].mode));
            else output = output + beatmapObject.toScoreTitle();
        }
        for (let i = 0, len = scoreObjects.length; i < len; i++) {
            output = output + scoreObjects[i].toString();
        }

        let deltaPP = topPP - yourPP;
        if (deltaPP > 0) {
            output = output + yourName + " 与#1相差 " + deltaPP + " pp\n"
        }
        else if (yourName) {
            if (yourName === topName) output = output + yourName + " 已经是#1了\n"
            else output = output + yourName + " 与#1的pp相同\n"
        }
        return output;
    }

    outputRippleBeatmapAndScoresString(rippleScoreObjects) {
        let rso = [];
        if (Array.isArray(rippleScoreObjects)) rso = rippleScoreObjects;
        else rso.push(rippleScoreObjects);
        let output = "";
        for (let i = 0, len = rso.length; i < len; i++) {
            output = output + rso[i].beatmap.toScoreTitle(rso[i].getScoreModeString());
            //output = output + rso[i].toString();
            output = output + rso[i].toCompleteString();
        }
        return output;
    }



}


module.exports = getScoreData;