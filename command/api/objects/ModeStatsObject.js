const utils = require('../utils');


class ModeStatsObject {
    constructor(modeStats) {
        this.accuracy = modeStats.accuracy;
        this.playcount = modeStats.playcount;
        this.level = modeStats.level;
        //this.country = user.country;
        this.countryRank = modeStats.country_leaderboard_rank;
        this.rank = modeStats.global_leaderboard_rank;
        this.pp = modeStats.pp;
        this.rankedScores = modeStats.ranked_score;
        this.play_time = modeStats.play_time;
    }

    toString() {
        let output = "";
        output = output + "acc：" + parseFloat(this.accuracy).toFixed(4) + "%\n";
        //output = output + "所属：" + this.country + "\n";
        output = output + "等级：" + parseFloat(this.level).toFixed(2) + "\n";
        output = output + "pp：" + this.pp + "\n";
        output = output + "全球排名：" + this.rank + "\n";
        output = output + "本地排名：" + this.countryRank + "\n";
        output = output + "游玩次数：" + this.playcount + "\n";
        output = output + "rank总分：" + utils.format_number(this.rankedScores) + "\n";
        output = output + "游戏时长：" + utils.getUserTimePlayed(this.play_time) + "\n";

        return output;
    }


    compareTo(oldModeStats) {
        const dAccuracy = this.accuracy - oldModeStats.accuracy;
        const dPlaycount = this.playcount - oldModeStats.playcount;
        const dLevel = this.level - oldModeStats.level;
        const dCountryRank = this.countryRank - oldModeStats.countryRank;
        const dRank = this.rank - oldModeStats.rank;
        const dPP = this.pp - oldModeStats.pp;
        const dRankedScores = this.rankedScores - oldModeStats.rankedScores;
        const dPlay_time = this.play_time - oldModeStats.play_time;
    }
}


module.exports = ModeStatsObject;