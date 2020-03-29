class utils {
    // 获取格式化游玩时长
    static getUserTimePlayed(play_time) {
        const s = parseInt(play_time);
        if (s <= 0) return "从来没玩过";
        const day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整 
        const hour = Math.floor((s - day * 24 * 3600) / 3600);
        const minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
        // const second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
        let output = "";
        if (day > 0) output = output + day + "天";
        if (hour > 0) output = output + hour + "小时";
        if (minute > 0) output = output + minute + "分";
        // if (second>0) output = output + second + "秒";
        return output;
    }
    // 整数每3位加逗号
    static format_number(n) {
        var b = parseInt(n).toString();
        var len = b.length;
        if (len <= 3) { return b; }
        var r = len % 3;
        return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
    }

    // enabled_mods转为字符串
    static getScoreModsString(enabledMods) {
        const modsArr = this.getScoreMods(enabledMods);
        let abbMods = [];
        let hasV2 = false;
        let hasRelax = false;
        for (let i = 0; i < modsArr.length; i++) {
            switch (modsArr[i]) {
                case "Hidden": { abbMods.push("HD"); break; }
                case "HardRock": { abbMods.push("HR"); break; }
                case "DoubleTime": { abbMods.push("DT"); break; }
                case "Nightcore": { abbMods.push("NC"); break; }
                case "Flashlight": { abbMods.push("FL"); break; }
                case "Easy": { abbMods.push("EZ"); break; }
                case "HalfTime": { abbMods.push("HT"); break; }
                case "NoFail": { abbMods.push("NF"); break; }
                case "SpunOut": { abbMods.push("SO"); break; }
                case "SuddenDeath": { abbMods.push("SD"); break; }
                case "Perfect": { abbMods.push("PF"); break; }
                case "Autopilot": { abbMods.push("AP"); break; }
                case "TouchDevice": { abbMods.push("TD"); break; }
                case "FadeIn": { abbMods.push("FI"); break; }
                case "Random": { abbMods.push("RD"); break; }
                case "Mirror": { abbMods.push("MR"); break; }
                case "Key1": { abbMods.push("1K"); break; }
                case "Key2": { abbMods.push("2K"); break; }
                case "Key3": { abbMods.push("3K"); break; }
                case "Key4": { abbMods.push("4K"); break; }
                case "Key5": { abbMods.push("5K"); break; }
                case "Key6": { abbMods.push("6K"); break; }
                case "Key7": { abbMods.push("7K"); break; }
                case "Key8": { abbMods.push("8K"); break; }
                case "Key9": { abbMods.push("9K"); break; }
                case "ScoreV2": { hasV2 = true; break; }
                case "Relax": { hasRelax = true; break; }
                default: { abbMods.push(modsArr[i]); break; }
            }
        }
        // 有NC时去掉DT
        const indexDT = abbMods.indexOf("DT");
        const indexNC = abbMods.indexOf("NC");
        if (indexNC >= 0) abbMods.splice(indexDT, 1);
        // 有PF时去掉SD
        const indexSD = abbMods.indexOf("SD");
        const indexPF = abbMods.indexOf("PF");
        if (indexPF >= 0) abbMods.splice(indexSD, 1);

        let modsString = abbMods.join("");
        if (!modsString) modsString = "None"
        // V2放后面
        if (hasV2) modsString = modsString + ", ScoreV2";
        // relax放最后面
        if (hasRelax) modsString = modsString + ", Relax";
        return modsString;
    }

    // mode转string
    static getModeString(mode) {
        if (mode !== 0 && mode !== "0" && !mode) return "当你看到这条信息说明代码有漏洞惹";
        let modeString = mode.toString();
        if (modeString === "0") return "Standard";
        else if (modeString === "1") return "Taiko";
        else if (modeString === "2") return "Catch The Beat";
        else if (modeString === "3") return "Mania";
        else return "未知";
    }
    // approved状态转string
    static getApprovedString(approved) {
        if (approved === "4") return "loved";
        else if (approved === "3") return "qualified";
        else if (approved === "2") return "approved";
        else if (approved === "1") return "ranked";
        else if (approved === "0") return "pending";
        else if (approved === "-1") return "WIP";
        else if (approved === "-2") return "graveyard";
        else return "未知";
    }
    static getRippleRankedString(ranked) {
        if (ranked === 5) return "loved";
        else if (ranked === 4) return "qualified";
        else if (ranked === 3) return "approved";
        else if (ranked === 2) return "ranked";
        else if (ranked === 1) return "需要更新";
        else if (ranked === 0) return "pending";
        else if (ranked === -1) return "未上传";
        else return "未知";
    }

    // 将秒数转化为分钟：秒
    static gethitLengthString(hitlength) {
        const hl = parseInt(hitlength);
        let min = Math.floor(hl / 60).toString();
        let sec = Math.floor(hl % 60).toString();
        if (min.length === 1) min = "0" + min;
        if (sec.length === 1) sec = "0" + sec;
        return min + ":" + sec;
    }

}


module.exports = utils;