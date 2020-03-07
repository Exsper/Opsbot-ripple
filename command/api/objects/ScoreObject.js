const utils = require('../utils');


class ScoreObject {
    constructor(score) {
        this.isRippleApi = false;
        // get_scores独有
        this.username = score.username || "";
        // get_user_recent/get_user_best独有
        this.beatmap_id = score.beatmap_id || "";

        // 公有
        this.score = score.score;
        this.maxcombo = score.maxcombo;
        this.count50 = parseInt(score.count50);
        this.count100 = parseInt(score.count100);
        this.count300 = parseInt(score.count300);
        this.countmiss = parseInt(score.countmiss);
        this.countkatu = parseInt(score.countkatu);
        this.countgeki = parseInt(score.countgeki);
        this.perfect = score.perfect;
        this.mods = score.enabled_mods;
        this.userId = score.user_id;
        this.date = score.date;
        this.rank = score.rank;
        this.pp = score.pp;

        // 自定义
        this.mode = -1;
        this.acc = -1;
        this.beatmapMaxcombo = -1;
    }

    // 给转谱Score加上Score mode ("0", "1", "2", "3")
    addMode(scoreMode) {
        this.mode = parseInt(scoreMode);
        return this;
    }

    // 计算acc，最好之前先addMode
    addAcc(beatmapObject) {
        const beatmapMode = beatmapObject.mode;
        if (beatmapMode === 1) {
            this.mode = 1;
            this.beatmapMaxcombo = beatmapObject.maxCombo;
            const total = this.count100 + this.count300 + this.countmiss;
            this.acc = total === 0 ? 0 : (((this.count300 + this.count100 * .5) * 300) / (total * 300));
            return this;
        }
        if (beatmapMode === 2) {
            this.mode = 2;
            this.beatmapMaxcombo = beatmapObject.maxCombo;
            const total = this.count50 + this.count100 + this.count300 + this.countkatu + this.countmiss;
            this.acc = total === 0 ? 0 : ((this.count50 + this.count100 + this.count300) / total);
            return this;
        }
        if (beatmapMode === 3) {
            this.mode = 3;
            this.beatmapMaxcombo = beatmapObject.maxCombo;
            const total = this.count50 + this.count100 + this.count300 + this.countkatu + this.countgeki + this.countmiss;
            this.acc = total === 0 ? 0 : ((this.count50 * 50 + this.count100 * 100 + this.countkatu * 200 + (this.count300 + this.countgeki) * 300) / (total * 300));
            return this;
        }
        // beatmapMode = 0
        if (this.mode > 0) {
            // beatmap api mode参数无效（不知道为什么），所以无法计算转谱成绩
            return this;
        }
        // std，或者还没有addMode
        this.mode = 0;
        this.beatmapMaxcombo = beatmapObject.maxCombo;
        const total = this.count50 + this.count100 + this.count300 + this.countkatu + this.countgeki + this.countmiss;
        this.acc = total === 0 ? 0 : ((this.count50 * 50 + this.count100 * 100 + this.countkatu * 200 + (this.count300 + this.countgeki) * 300) / (total * 300));
        return this;
    }

    getScoreModeString() {
        if (this.mode <= 0) return "";
        return utils.getModeString(this.mode);
    }

    toString() {
        const name = (!this.username) ? "" : this.username + "\t ";
        const comboString = (this.beatmapMaxcombo < 0) ? "combo: " + this.maxcombo + "\t " : this.maxcombo + "x/" + this.beatmapMaxcombo + "x\t ";
        const accString = (this.acc < 0) ? "" : (this.acc * 100).toFixed(2) + "%\t ";
        const modsString = utils.getScoreModsString(this.mods);
        const ppString = (this.pp === "0") ? "" : this.pp + "pp";
        return name + comboString + accString + utils.format_number(this.score) + "\t " + this.rank + "\t | " + modsString + "\t " + ppString + "\n";
    }

}

module.exports = ScoreObject;