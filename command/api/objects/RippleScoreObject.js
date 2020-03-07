const utils = require('../utils');
const RippleBeatmapObject = require('./RippleBeatmapObject');

class RippleScoreObject {
    constructor(score) {
        this.isRippleApi = true;
        // 没找到username
        this.username = "";

        // beatmap 部分
        this.beatmap = new RippleBeatmapObject(score.beatmap);

        this.score = score.score;
        this.maxcombo = score.max_combo;
        this.count50 = parseInt(score.count_50);
        this.count100 = parseInt(score.count_100);
        this.count300 = parseInt(score.count_300);
        this.countmiss = parseInt(score.count_miss);
        this.countkatu = parseInt(score.count_katu);
        this.countgeki = parseInt(score.count_geki);
        // this.perfect = score.perfect;
        this.mods = score.mods;
        // this.userId = score.user_id;
        this.date = score.time;
        this.rank = score.rank;
        this.pp = score.pp;

        this.mode = score.play_mode;
        this.acc = score.accuracy;
    }

    getScoreModeString() {
        if (this.mode <= 0) return "";
        return utils.getModeString(this.mode);
    }

    toString() {
        const name = (!this.username) ? "" : this.username + "\t ";
        // 转谱combo不准确或为0
        const comboString = (this.mode === 0) ? this.maxcombo + "x/" + this.beatmap.maxCombo + "x\t " : "combo: " + this.maxcombo + "\t ";
        const accString = this.acc.toFixed(2) + "%\t ";
        const modsString = utils.getScoreModsString(this.mods);
        const ppString = (this.pp === 0) ? "" : this.pp + "pp";
        return name + comboString + accString + utils.format_number(this.score) + "\t " + this.rank + "\t | " + modsString + "\t " + ppString + "\n";
    }

}

module.exports = RippleScoreObject;