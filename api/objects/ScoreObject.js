"use strict";

const utils = require('../utils');
const BeatmapObject = require('./BeatmapObject');
const SimpleUserObject = require("./SimpleUserObject");

class ScoreObject {
    // ripple api的/recent和/best有beatmap没有user，/score有user没有beatmap
    constructor(score, beatmap, user) {

        if (score.beatmap) this.beatmap = new BeatmapObject(score.beatmap, true);
        else this.beatmap = new BeatmapObject(beatmap);
        if (score.user) this.user = new SimpleUserObject(score.user)
        else this.user = new SimpleUserObject(user)

        this.score = score.score;
        this.maxcombo = score.max_combo;
        this.count50 = score.count_50;
        this.count100 = score.count_100;
        this.count300 = score.count_300;
        this.countmiss = score.count_miss;
        this.countkatu = score.count_katu;
        this.countgeki = score.count_geki;

        this.mods = score.mods;
        this.date = score.time;
        this.rank = score.rank;
        this.pp = score.pp; // 非std图，recent获取的pp为0.001，未完成的pp为0

        this.completed = score.completed; // 0为未完成，2可能是非最好成绩，3可能是最好成绩

        this.acc = score.accuracy;
        this.mode = score.play_mode;
    }

    toString() {
        const name = this.user.username + " \t ";
        const comboString = (this.mode === 0) ? this.maxcombo + "x/" + this.beatmap.maxCombo + "x \t " : "combo: " + this.maxcombo + " \t ";
        const accString = this.acc.toFixed(2) + "% \t ";
        const modsString = utils.getScoreModsString(this.mods);
        const ppString = (this.pp === 0 || this.completed === 0) ? "" : parseFloat(this.pp).toFixed(2) + "pp";
        return name + comboString + accString + utils.format_number(this.score) + " \t " + this.rank + " \t | " + modsString + " \t " + ppString;
    }

    toCompleteString() {
        const name = "玩家：" + this.user.username + "\n";
        const comboString = (this.mode !== 0) ? "combo: " + this.maxcombo + "\n" : "combo: " + this.maxcombo + "/" + this.beatmap.maxCombo + "\n";
        const accString = "ACC：" + this.acc.toFixed(2) + "%\n";
        const modsString = "mod：" + utils.getScoreModsString(this.mods) + "\n";
        const rankString = "rank：" + this.rank + "\n";
        const ppString = (this.pp === 0 || this.completed === 0) ? "" : "pp：" + this.pp.toFixed(2) + "pp\n";
        const scoreString = "分数：" + utils.format_number(this.score) + "\n";
        const count300String = (this.count300 <= 0) ? "" : "300：" + this.count300 + "  ";
        const count100String = (this.count100 <= 0) ? "" : "100：" + this.count100 + "  ";
        const count50String = (this.count50 <= 0) ? "" : "50：" + this.count50 + "  ";
        const countMissString = (this.countmiss <= 0) ? "" : "miss：" + this.countmiss;
        const hitCountString = count300String + count100String + count50String + countMissString;
        return name + comboString + accString + modsString + rankString + ppString + scoreString + hitCountString;
    }

}

module.exports = ScoreObject;