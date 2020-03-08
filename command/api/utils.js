class utils {
    // 获取格式化游玩时长
    static getUserTimePlayed(play_time) {
        const s = parseInt(play_time);
        const day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整 
        const hour = Math.floor((s - day * 24 * 3600) / 3600);
        const minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
        const second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
        return day + "天" + hour + "时" + minute + "分" + second + "秒";
    }
    // 整数每3位加逗号
    static format_number(n) {
        var b = parseInt(n).toString();
        var len = b.length;
        if (len <= 3) { return b; }
        var r = len % 3;
        return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
    }
    // enabled_mods转为mods数组
    static getScoreMods(enabledMods) {
        let raw_mods = parseInt(enabledMods);
        const Mods = {
            'None': 0,
            'NoFail': 1,
            'Easy': 1 << 1,
            'TouchDevice': 1 << 2,
            'Hidden': 1 << 3,
            'HardRock': 1 << 4,
            'SuddenDeath': 1 << 5,
            'DoubleTime': 1 << 6,
            'Relax': 1 << 7,
            'HalfTime': 1 << 8,
            'Nightcore': 1 << 9, // DoubleTime
            'Flashlight': 1 << 10,
            'Autoplay': 1 << 11,
            'SpunOut': 1 << 12,
            'Relax2': 1 << 13, // Autopilot
            'Perfect': 1 << 14, // SuddenDeath
            'Key4': 1 << 15,
            'Key5': 1 << 16,
            'Key6': 1 << 17,
            'Key7': 1 << 18,
            'Key8': 1 << 19,
            'FadeIn': 1 << 20,
            'Random': 1 << 21,
            'Cinema': 1 << 22,
            'Target': 1 << 23,
            'Key9': 1 << 24,
            'KeyCoop': 1 << 25,
            'Key1': 1 << 26,
            'Key3': 1 << 27,
            'Key2': 1 << 28,
            'KeyMod': 521109504,
            'FreeModAllowed': 522171579,
            'ScoreIncreaseMods': 1049662
        };
        let modsArr = [];
        for (const mod in Mods) {
            if (raw_mods & Mods[mod]) modsArr.push(mod);
        }
        return modsArr;
    }

    // enabled_mods转为字符串
    static getScoreModsString(enabledMods) {
        const modsArr = this.getScoreMods(enabledMods);
        // 只需要把常用的提取出来就好了
        let abbMods = [];
        let hasRelax = false;
        for (let i = 0; i < modsArr.length; i++) {
            if (modsArr[i] === "Hidden") abbMods.push("HD");
            else if (modsArr[i] === "HardRock") abbMods.push("HR");
            else if (modsArr[i] === "DoubleTime") abbMods.push("DT");
            else if (modsArr[i] === "Nightcore") abbMods.push("NC");
            else if (modsArr[i] === "Flashlight") abbMods.push("FL");
            else if (modsArr[i] === "Easy") abbMods.push("EZ");
            else if (modsArr[i] === "HalfTime") abbMods.push("HT");
            else if (modsArr[i] === "NoFail") abbMods.push("NF");
            else if (modsArr[i] === "SpunOut") abbMods.push("SO");
            //else if (modsArr[i] === "TouchDevice") abbMods.push("TD");
            else if (modsArr[i] === "KeyMod") abbMods.push("KeyMod");
            else if (modsArr[i] === "Relax") hasRelax = true;
        }
        // 有NC时去掉DT
        const indexDT = abbMods.indexOf("DT");
        const indexNC = abbMods.indexOf("NC");
        if (indexNC >= 0) abbMods.splice(indexDT, 1);
        let modsString = abbMods.join("");
        if (!modsString) modsString = "None"
        // relax放最后面
        if (hasRelax) modsString = modsString + ", Relax";
        return modsString;
    }

    // 计算mods数值（指令+号后面的）
    static getEnabledModsValue(modsString) {
        let mods = {
            //None : 0,
            NF: 1,
            EZ: 2,
            //TD : 4, //TouchDevice
            HD: 8,
            HR: 16,
            SD: 32,
            DT: 64,
            //Relax : 128,
            HT: 256,
            NC: 512, // Only set along with DoubleTime. i.e: NC only gives 576
            FL: 1024,
            //Autoplay : 2048,
            SO: 4096,
            //Relax2 : 8192,    // Autopilot
            PF: 16384, // Only set along with SuddenDeath. i.e: PF only gives 16416  
            '4K': 32768,
            '5K': 65536,
            '6K': 131072,
            '7K': 262144,
            '8K': 524288,
            FI: 1048576,
            //Random : 2097152,
            //Cinema : 4194304,
            //Target : 8388608,
            '9K': 16777216,
            //KeyCoop : 33554432,
            '1K': 67108864,
            '3K': 134217728,
            '2K': 268435456
            //ScoreV2 : 536870912,
            //Mirror : 1073741824,
            //KeyMod : Key1 | Key2 | Key3 | Key4 | Key5 | Key6 | Key7 | Key8 | Key9 | KeyCoop,
            //FreeModAllowed : NoFail | Easy | Hidden | HardRock | SuddenDeath | Flashlight | FadeIn | Relax | Relax2 | SpunOut | KeyMod,
            //ScoreIncreaseMods : Hidden | HardRock | DoubleTime | Flashlight | FadeIn
        };
        let sum = 0;
        let i = 0;
        let length = modsString.length;
        while (i + 2 <= length) {
            let s = modsString.substring(i, i + 2);
            if (mods[s] !== undefined) {
                if (s === 'NC') sum = sum + mods.DT;
                else if (s === 'PF') sum = sum + mods.SD;
                sum = sum + mods[s];
            }
            i += 2;
        }
        return sum;
    }

    // String转mode
    static getMode(modeString) {
        let s = modeString.trim().toLowerCase();
        if (s === "0" || s === "1" || s === "2" || s === "3") return s;
        else if (s.indexOf("std") >= 0) return "0";
        else if (s.indexOf("standard") >= 0) return "0";
        else if (s.indexOf("click") >= 0) return "0";
        else if (s.indexOf("泡泡") >= 0) return "0";
        else if (s.indexOf("taiko") >= 0) return "1";
        else if (s.indexOf("鼓") >= 0) return "1";
        else if (s.indexOf("catch") >= 0) return "2";
        else if (s.indexOf("ctb") >= 0) return "2";
        else if (s.indexOf("接") >= 0) return "2";
        else if (s.indexOf("mania") >= 0) return "3";
        else if (s.indexOf("key") >= 0) return "3";
        else if (s.indexOf("骂娘") >= 0) return "3";
        else if (s === "s") return "0";
        else if (s === "t") return "1";
        else if (s === "c") return "2";
        else if (s === "m") return "3";
        //else return s;
        else return "0";
    }
    // mode转string
    static getModeString(mode) {
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