"use strict";

const CommandsInfo = require("./command/CommandsInfo");
const Command = require("./command/Command");

// Koishi插件名
module.exports.name = "opsbot-ripple";

// 插件处理和输出
module.exports.apply = (ctx, config = {}) => {
	const prefix = config.prefix || "*";
	const prefix2 = config.prefix2 || "%";
	const host = config.host || "osu.ppy.sb";
	const database = config.database || './Opsbot-Ripple-v1.db';

	const nedb = require('./database/nedb')(database);
	const commandsInfo = new CommandsInfo(prefix, prefix2);

	ctx.middleware(async (meta, next) => {
		try {
			let commandObject = new Command(meta, host);
			let reply = await commandObject.execute(commandsInfo, nedb);
			if (reply !== "") return meta.$send(`[CQ:at,qq=${meta.userId}]` + "\n" + reply);
			return next();
		} catch (ex) {
			console.log(ex);
			return next();
		}
	});
};
