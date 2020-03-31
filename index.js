"use strict";

const CommandsInfo = require("./command/CommandsInfo");
const Command = require("./command/Command");

const fs = require('fs');
const path = require('path');
const thisPath = __dirname;

// Koishi插件名
module.exports.name = "opsbot-ripple";

// 插件处理和输出
module.exports.apply = (ctx) => {
	let settingsPath = './opsbot-settings.json';


	const samepleSettingsPath = path.join(thisPath, "./opsbot-settings-sample.json");
	let exists = fs.existsSync(settingsPath);
	if (!exists) {
		fs.copyFileSync(samepleSettingsPath, settingsPath, (err) => {
			if (err) throw err;
		});
	}
	let data = fs.readFileSync(settingsPath);
	const config = JSON.parse(data.toString());
	const admin = config.admin || [];
	const prefix = config.prefix || "*";
	const prefix2 = config.prefix2 || "%";
	const host = config.host || "osu.ppy.sb";
	const database = config.database || './Opsbot-Ripple-v1.db';

	const nedb = require('./database/nedb')(database);
	const commandsInfo = new CommandsInfo(prefix, prefix2);

	ctx.middleware(async (meta, next) => {
		try {
			let commandObject = new Command(meta, host, admin);
			let reply = await commandObject.execute(commandsInfo, nedb);
			if (reply !== "") return meta.$send(`[CQ:at,qq=${meta.userId}]` + "\n" + reply);
			return next();
		} catch (ex) {
			console.log(ex);
			return next();
		}
	});
};
