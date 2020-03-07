const CommandsInfo = require("./CommandsInfo");
const getBeatmapData = require("./api/beatmap/getBeatmapData");
const getScoreData = require("./api/score/getScoreData");
const getUserData = require("./api/user/getUserData");
const getBestScoresData = require("./api/best/getBestScoresData");
const getRecentScoresData = require("./api/recent/getRecentScoresData");

class RunApiCommand {
    async run(osuApi, command, argObjects) {
        // 下达任务
        const commandsInfo = new CommandsInfo();
        if (command.commandType === commandsInfo.apiType.beatmap)
            return await new getBeatmapData().outputBeatmap(osuApi, argObjects[0]);
        else if (command.commandType === commandsInfo.apiType.user)
            return await new getUserData().outputUser(osuApi, argObjects[0]);
        else if ((command.commandType === commandsInfo.apiType.score) || (command.commandType === commandsInfo.apiType.scoreVs))
            return await new getScoreData().outputScores(osuApi, argObjects);
        else if (command.commandType === commandsInfo.apiType.scoreTop)
            return await new getScoreData().outputTopScore(osuApi, argObjects[0]);
        else if (command.commandType === commandsInfo.apiType.scoreVsTop)
            return await new getScoreData().outputVsTopScore(osuApi, argObjects[0]);
        else if (command.commandType === commandsInfo.apiType.bestList)
            return await new getBestScoresData().outputBestList(osuApi, argObjects[0]);
        else if (command.commandType === commandsInfo.apiType.best)
            return await new getBestScoresData().outputBest(osuApi, argObjects[0]);
        else if (command.commandType === commandsInfo.apiType.recent)
            return await new getRecentScoresData().outputRecentest(osuApi, argObjects[0]);
        else if (command.commandType === commandsInfo.apiType.recentPassed)
            return await new getRecentScoresData().getRecentestPassed(osuApi, argObjects[0]);
        else if (command.commandType === commandsInfo.apiType.recentRx)
            return await new getRecentScoresData().outputRecentestRx(osuApi, argObjects[0]);
        else if (command.commandType === commandsInfo.apiType.recentPassedRx)
            return await new getRecentScoresData().getRecentestPassedRx(osuApi, argObjects[0]);
        else return ""; // 未知指令
    }
}

module.exports = RunApiCommand;