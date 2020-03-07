const ApiOptions = require("./api/apiOptions");


class Command {
    constructor(commandClass, commandType, commandInfo) {
        this.commandClass = commandClass;
        this.commandType = commandType;
        this.commandInfo = commandInfo;
        this.isCommand = true;
        this.isError = false;
        this.errorMessage = "";
    }

    getErrorMessage() {
        return this.errorMessage;
    }

    getHelpContent() {
        let help = "";
        help = help + this.commandInfo.info + "\n";
        help = help + "指令：" + this.commandInfo.command.join("/") + "\n";
        help = help + "参数：" + this.commandInfo.argsInfo + "\n";
        help = help + this.commandInfo.note;
        return help;
    }

    setNotCommand() {
        this.isCommand = false;
        return this;
    }
    setError(errorMessage) {
        this.isError = true;
        this.errorMessage = errorMessage;
        return this;
    }

    getApiOptions(argsString, userOsuInfo) {
        const mr = this.commandInfo.reg.exec(argsString);
        if (mr === null) {
            this.setError("参数格式解析错误：" + argsString);
            return new ApiOptions();
        }
        let args = {};
        for (let i = 1; i < mr.length; ++i) {
            let key = this.commandInfo.args[i];
            if (mr[i] === undefined || mr[i] === "null" || mr[i].trim() === "") {
                if (!this.commandInfo.argsFromUserInfo[i]) continue;
                let value = "";
                if (userOsuInfo.osuId > 0 && this.commandInfo.args[i] === "u") value = userOsuInfo.osuId;
                else if (userOsuInfo.defaultMode && this.commandInfo.args[i] === "m") value = userOsuInfo.defaultMode;
                else continue;
                Object.assign(args, { [key]: value });
            }
            else {
                Object.assign(args, { [key]: mr[i].trim() });
            }
        }
        let user = [args.u, args.u2];
        user = user.filter(item => item); // 去除空值
        return new ApiOptions(args.b, user, args.limit, args.mods, args.m);
    }

    getBotOptions(argsString) {   // 暂时用不到userOsuInfo
        const mr = this.commandInfo.reg.exec(argsString);
        if (mr === null) {
            this.setError("参数格式解析错误：" + argsString);
            return null;
        }
        let args = {};
        for (let i = 1; i < mr.length; ++i) {
            let key = this.commandInfo.args[i];
            if (mr[i] === undefined) {
                let value = "";
                Object.assign(args, { [key]: value });
            }
            else {
                Object.assign(args, { [key]: mr[i].trim() });
            }
        }
        delete args.useless;
        return args;
    }

}

module.exports = Command;