"use strict";

const UserInfo = require("./user/UserInfo");
const CommandObject = require("./command/CommandObject");
const OsuApi = require("./command/api/ApiRequest");

// Koishi插件名
module.exports.name = "opsbot-ripple";

// 插件处理和输出
module.exports.apply = (ctx, config = {}) => {
	const prefix = config.prefix || "$";
	const prefix2 = config.prefix2 || "￥";
	const host = config.host || "osu.ppy.sb";

	const osuApi = new OsuApi(host);

	// nedb保存userName
	// 你说要保存stat记录？咕咕咕
	const nedb = require('./database/nedb')(__dirname + '/database/data/save.db');

	ctx.middleware(async (meta, next) => {
		try {
			const qqId = meta.userId;
			let userInfo = new UserInfo(meta);
			let userOsuInfo = await userInfo.getUserOsuInfo(meta.userId, nedb);
			let commandObject = new CommandObject(meta, meta.message);
			let reply = await commandObject.execute(osuApi, userOsuInfo, nedb, prefix, prefix2);
			if (reply !== "") return meta.$send(`[CQ:at,qq=${qqId}]` + "\n" + reply);
			return next();
		} catch (ex) {
			console.log(ex);
			return next();
		}
	});
};
