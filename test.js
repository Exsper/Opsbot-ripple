"use strict";

const CommandsInfo = require("./command/CommandsInfo");
const Command = require("./command/Command");

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


const fs = require('fs');
const path = require('path');
const thisPath = __dirname;


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


let myQQ = 1;
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("line", (line) => {
    if (line === "qq2") {
        myQQ = 2;
        console.log("你的QQ号是2了");
    }
    else if (line === "qq1") {
        myQQ = 1;
        console.log("你的QQ号是1了");
    }
    else if (line === "qq3") {
        myQQ = 3;
        console.log("你的QQ号是3了");
    }
    else run(new Meta(myQQ, line), next);
});



async function run(meta, next) {
    try {
        let commandObject = new Command(meta, host, admin);
        let reply = await commandObject.execute(commandsInfo, nedb);
        if (reply !== "") return meta.$send(`[CQ:at,qq=${meta.userId}]` + "\n" + reply);
        return next();
    } catch (ex) {
        console.log(ex);
        return next();
    }
}


