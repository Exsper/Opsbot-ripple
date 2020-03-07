const utils = require('../utils');


class UserObject {
    constructor(user) {
        this.userId = user.user_id;
        this.username = user.username;
        this.accuracy = parseFloat(user.accuracy).toFixed(4);
        this.playcount = user.playcount;
        this.level = parseFloat(user.level).toFixed(2);
        //this.country = user.country;
        this.countryRank = user.pp_country_rank;
        this.rank = user.pp_rank;
        this.pp = user.pp_raw;
        this.rankedScores = utils.format_number(user.ranked_score);
    }

    toString() {
        let output = "";
        output = output + this.username + " 的详细信息：\n";
        output = output + "id：" + this.userId + "\n";
        output = output + "acc：" + this.accuracy + "%\n";
        //output = output + "所属：" + this.country + "\n";
        output = output + "等级：" + this.level + "\n";
        output = output + "pp：" + this.pp + "\n";
        output = output + "全球排名：" + this.rank + "\n";
        output = output + "本地排名：" + this.countryRank + "\n";
        output = output + "游玩次数：" + this.playcount + "\n";
        output = output + "rank总分：" + this.rankedScores + "\n";

        return output;
    }
}


module.exports = UserObject;