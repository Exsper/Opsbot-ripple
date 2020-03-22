"use strict";

/**
 * 指令参数对象
 * @prop {Number} beatmapId 谱面Id，没直接提供为-1，需要通过osusearch获取
 * @prop {Object} beatmapSearchInfo 谱面待搜索的信息
 * @prop {String} beatmapSearchInfo.artist 
 * @prop {String} beatmapSearchInfo.title 
 * @prop {String} beatmapSearchInfo.mapper 
 * @prop {String} beatmapSearchInfo.diff_name 
 */
class Arg {
    /**
     * 构建Arg对象
     * @param {Object} args 从指令参数字符串拿到的各参数字符串
     * @param {String} args.beatmapString beatmap字符串，谱面Id或是需要search的谱面字符串
     * @param {String} args.usersString 玩家名字符串，以/分割
     */
    constructor(args) {
        this.beatmapId = -1;
        this.beatmapSearchInfo = {};
        this.getBeatmap(args.beatmapString);
        this.users = this.getUsers(args.usersString);

    }


    /**
     * 判断字符串是否为正整数
     * @param {String} s 
     * @returns {Boolean} 是正整数
     */
    checkInt(s) {
        var re = /^\d+$/;
        return (re.test(s));
    }


    
    /**
     * 获取搜索谱面args
     * @param {String} beatmapString 1234567 或 artist - title(mapper)[diff_name]
     * @return {}
     */
    getBeatmap(beatmapString) {
        if (this.checkInt(beatmapString)) this.beatmapId = parseInt(beatmapString);
        else {
            this.beatmapSearchInfo.
        }
    }

    /**
     * 只用于查询单个谱面的多人成绩
     * @param {String} userString 以/分割的玩家名
     * @returns {Array<String>} 玩家名集合
     */
    getUsers(userString) {
        let users = [];
        if (typeof userString !== "string") return users;
        users = userString.split("/").filter(d => d);
        return users;
    }
}