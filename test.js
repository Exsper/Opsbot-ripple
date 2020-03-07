"use strict";

const UserInfo = require("./user/UserInfo");
const CommandObject = require("./command/CommandObject");
const OsuApi = require("./command/api/ApiRequest");

// 模拟meta
console.log("你的QQ号是1了");
class Meta {
    constructor(qqId, ask) {
        this.userId = qqId; // 发送者id
        this.selfId = 114514; // 机器人id
        this.message = ask;
    }
    $send(s) {
        console.log("向" + this.userId + "发送消息：" + s);
    }
    $ban(t) {
        console.log(this.userId + "已被禁言 " + t + " 秒");
    }
}


// 模拟next
// eslint-disable-next-line require-jsdoc
function next() {
    console.log("不处理，转向下一个插件");
}


const prefix = "$";
const prefix2 = "￥";
const osuApi = new OsuApi();
const nedb = require('./database/nedb')(__dirname + '/database/data/save.db');


let myQQ = "1";
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("line", (line) => {
    if (line === "qq2") {
        myQQ = "2";
        console.log("你的QQ号是2了");
    }
    else if (line === "qq1") {
        myQQ = "1";
        console.log("你的QQ号是1了");
    }
    else run(new Meta(myQQ, line), next);
});



async function run(meta, next) {
    try {
        let userInfo = new UserInfo(meta);
        let userOsuInfo = await userInfo.getUserOsuInfo(meta.userId, nedb);
        let commandObject = new CommandObject(meta, meta.message);
        let reply = await commandObject.execute(osuApi, userOsuInfo, nedb, prefix, prefix2);
        if (reply !== "") return meta.$send(reply);
        return next();
    } catch (ex) {
        console.log(ex);
        return next();
    }
}


