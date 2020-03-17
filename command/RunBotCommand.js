const CommandsInfo = require("./CommandsInfo");
const UserInfo = require("../user/UserInfo");
class RunBotCommand {
    async run(meta, rippleApi, command, argObjects, nedb) {
        // 下达任务
        const commandsInfo = new CommandsInfo();
        if (command.commandType === commandsInfo.botCommandType.bind)
            return await UserInfo.bindUser(rippleApi, nedb, meta.userId, argObjects);
        else if (command.commandType === commandsInfo.botCommandType.unbind)
            return await UserInfo.unbindUser(nedb, meta.userId);
        else if (command.commandType === commandsInfo.botCommandType.mode)
            return await UserInfo.setMode(nedb, meta.userId, argObjects.m);
        else return ""; // 未知指令
    }
}

module.exports = RunBotCommand;