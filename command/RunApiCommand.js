const CommandsInfo = require("./CommandsInfo");
const getBeatmapData = require("./api/getBeatmapData");
const getScoreData = require("./api/getScoreData");
const getUserData = require("./api/getUserData");
const getBestScoresData = require("./api/getBestScoresData");
const getRecentScoresData = require("./api/getRecentScoresData");

class RunApiCommand {
    async run(osuApi, rippleApi, command, argObjects) {
        // 下达任务
        const commandsInfo = new CommandsInfo();
        if (command.commandType === commandsInfo.apiType.beatmap)
            return await new getBeatmapData().outputBeatmap(osuApi, argObjects[0]);

        else if (command.commandType === commandsInfo.apiType.user)
            return await new getUserData().outputUser(rippleApi, argObjects[0]);

        else if ((command.commandType === commandsInfo.apiType.score) || (command.commandType === commandsInfo.apiType.scoreVs))
            return await new getScoreData().outputScores(osuApi, argObjects);

        else if (command.commandType === commandsInfo.apiType.scoreTop)
            return await new getScoreData().outputTopScore(osuApi, argObjects[0]);

        else if (command.commandType === commandsInfo.apiType.scoreVsTop)
            return await new getScoreData().outputVsTopScore(osuApi, argObjects[0]);

        else if (command.commandType === commandsInfo.apiType.bestList)
            return await new getBestScoresData().outputBestList(rippleApi, argObjects[0]);

        else if (command.commandType === commandsInfo.apiType.best)
            return await new getBestScoresData().outputBest(rippleApi, argObjects[0]);

        else if (command.commandType === commandsInfo.apiType.bestListRx)
            return await new getBestScoresData().outputBestListRx(rippleApi, argObjects[0]);

        else if (command.commandType === commandsInfo.apiType.bestRx)
            return await new getBestScoresData().outputBestRx(rippleApi, argObjects[0]);

        else if (command.commandType === commandsInfo.apiType.recent)
            return await new getRecentScoresData().outputRecentest(rippleApi, argObjects[0]);

        else if (command.commandType === commandsInfo.apiType.recentPassed)
            return await new getRecentScoresData().getRecentestPassed(rippleApi, argObjects[0]);

        else if (command.commandType === commandsInfo.apiType.recentRx)
            return await new getRecentScoresData().outputRecentestRx(rippleApi, argObjects[0]);

        else if (command.commandType === commandsInfo.apiType.recentPassedRx)
            return await new getRecentScoresData().getRecentestPassedRx(rippleApi, argObjects[0]);

        else return ""; // 未知指令
    }
}

module.exports = RunApiCommand;