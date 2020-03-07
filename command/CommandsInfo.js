function CommandsInfo(prefix = '$', prefix2 = '￥') {
    this.prefix = prefix;
    this.prefix2 = prefix2;
    this.help = {
        args: "[]中的参数为必要参数，()中的参数为可选参数\n",
        userName: "绑定后username可以直接省略，纯数字id可以尝试在名字前后加上\"号\n"
    };
    this.apiType = {
        beatmap: 'apibeatmap',
        user: 'apiuser',
        score: 'apiscore',
        scoreTop: 'apiscoreTop',
        scoreVs: 'apiscoreVs',
        scoreVsTop: 'apiscoreVsTop',
        best: 'apibest',
        bestList: 'apibestList',
        recent: 'apirecent',
        recentRx: 'apirecentRx',
        recentPassed: 'apirecentPassed',
        recentPassedRx: 'apirecentPassedRx'
    };
    this.apiCommands = [
        {
            info: '谱面查询',
            command: ['b', 'map', 'beatmap', 'search'],
            type: this.apiType.beatmap,
            //api: 'getBeatmaps',
            argsInfo: '[beatmap_id](+mods)(:mode)',
            args: ['orgArgs', 'b', 'mods', 'm'],
            argsFromUserInfo: [false, true, false, false],    // mode 不要指定模式
            reg: /^([0-9]+)[\+]?([a-zA-Z0-9]+)?[:：]?(.+)?/i,
            note: this.help.args
        }, {
            info: '玩家查询',
            command: ['u', 'user', 'p', 'player', 'stat', 'statme', 'ume'],
            type: this.apiType.user,
            //api: 'getUser',
            argsInfo: '(user_id/"username")(:mode)',
            args: ['orgArgs', 'u', 'm'],
            argsFromUserInfo: [false, true, true],
            reg: /^([^:+#]+)?[:：]?(.+)?/i,
            note: this.help.args + this.help.userName
        }, {
            info: '谱面成绩查询',
            command: ['s', 'score', 'me', 'sme', 'scoreme'],
            type: this.apiType.score,
            //api: 'getScores',
            argsInfo: '[beatmap_id] (user_id/"username")(+mods)(:mode)',
            args: ['orgArgs', 'b', 'u', 'mods', 'm'],
            argsFromUserInfo: [false, false, true, false, true],
            reg: /^([0-9]+)([^:+#]+)?[\+]?([a-zA-Z0-9]+)?[:：]?(.+)?/i,
            note: this.help.args + this.help.userName
        }, {
            info: '谱面最高成绩查询',
            command: ['t', 'top'],
            type: this.apiType.scoreTop,
            //api: 'getScores',
            argsInfo: '[beatmap_id](+mods)(:mode)',
            args: ['orgArgs', 'b', 'mods', 'm'],
            argsFromUserInfo: [false, false, false, true],
            reg: /^([0-9]+)[\+]?([a-zA-Z0-9]+)?[:：]?(.+)?/i,
            note: this.help.args
        }, {
            info: '谱面成绩vs查询',   // 暂时只做了2人对比，多人应该只要改一下正则就好了
            command: ['vs', 'svs', 'scorevs'],
            type: this.apiType.scoreVs,
            //api: 'getScores',
            argsInfo: '[beatmap_id] (user_id/"username")|[user_id/"username"](+mods)(:mode)',
            args: ['orgArgs', 'b', 'u', 'u2', 'mods', 'm'],
            argsFromUserInfo: [false, false, true, false, false, true],
            reg: /^([0-9]+)([^:+#\|]+)?\|([^:+#\|]+)[\+]?([a-zA-Z0-9]+)?[:：]?(.+)?/i,
            note: this.help.args + this.help.userName
        }, {
            info: '谱面成绩vstop查询',
            command: ['vstop', 'topvs'],
            type: this.apiType.scoreVsTop,
            //api: 'getScores',
            argsInfo: '[beatmap_id] (user_id/"username")(+mods)(:mode)',
            args: ['orgArgs', 'b', 'u', 'mods', 'm'],
            argsFromUserInfo: [false, false, true, false, true],
            reg: /^([0-9]+)([^:+#]+)?[\+]?([a-zA-Z0-9]+)?[:：]?(.+)?/i,
            note: this.help.args + this.help.userName
        }, {
            info: 'bp成绩查询',
            command: ['bp', 'best', 'bpme'],
            type: this.apiType.best,
            //api: 'getUserBest',
            argsInfo: '(user_id/"username")[#number](:mode)',
            args: ['orgArgs', 'u', 'limit', 'm'],
            argsFromUserInfo: [false, true, false, true],
            reg: /^([^:+#]+)?[#]([0-9]+)[:：]?(.+)?/i,
            note: this.help.args + this.help.userName
        }, {
            info: 'bp列表查询',
            command: ['bbp', 'bests', 'mybp'],
            type: this.apiType.bestList,
            //api: 'getUserBest',
            argsInfo: '(user_id/"username")(:mode)',
            args: ['orgArgs', 'u', 'm'],
            argsFromUserInfo: [false, true, true],
            reg: /^([^:+#]+)?[:：]?(.+)?/i,
            note: this.help.args + this.help.userName
        }, {
            info: '获取最近Relax成绩（包括未pass成绩）',
            command: ['rrx', 'rctrx', 'rctpprx', 'recentrx'],
            type: this.apiType.recentRx,
            //api: 'getUserRecent',
            argsInfo: '(user_id/"username")(:mode)',
            args: ['orgArgs', 'u', 'm'],
            argsFromUserInfo: [false, true, true],
            reg: /^([^:+#]+)?[:：]?(.+)?/i,
            note: this.help.args + this.help.userName
        }, {
            info: '获取最近成绩（包括未pass成绩）',
            command: ['r', 'rct', 'rctpp', 'recent'],
            type: this.apiType.recent,
            //api: 'getUserRecent',
            argsInfo: '(user_id/"username")(:mode)',
            args: ['orgArgs', 'u', 'm'],
            argsFromUserInfo: [false, true, true],
            reg: /^([^:+#]+)?[:：]?(.+)?/i,
            note: this.help.args + this.help.userName
        }, {
            info: '获取最近Relax成绩（不包括未pass成绩）',
            command: ['prrx'],
            type: this.apiType.recentPassedRx,
            //api: 'getUserRecent',
            argsInfo: '(user_id/"username")(:mode)',
            args: ['orgArgs', 'u', 'm'],
            argsFromUserInfo: [false, true, true],
            reg: /^([^:+#]+)?[:：]?(.+)?/i,
            note: this.help.args + this.help.userName
        }, {
            info: '获取最近成绩（不包括未pass成绩）',
            command: ['pr'],
            type: this.apiType.recentPassed,
            //api: 'getUserRecent',
            argsInfo: '(user_id/"username")(:mode)',
            args: ['orgArgs', 'u', 'm'],
            argsFromUserInfo: [false, true, true],
            reg: /^([^:+#]+)?[:：]?(.+)?/i,
            note: this.help.args + this.help.userName
        }
    ];
    this.botCommandType = {
        bind: 'botbind',
        unbind: 'botunbind',
        mode: 'botmode'
    };
    this.botCommands = [
        {
            info: '绑定osu账号',
            command: ['bind', 'set', 'setid'],
            type: this.botCommandType.bind,
            argsInfo: '[user_id](:mode)',
            args: ['orgArgs', 'u', 'm'],
            argsFromUserInfo: [false, false, false],
            reg: /^([^:+#]+)[:：]?(.+)?/i,
            note: ""
        }, {
            info: '解绑osu账号',
            command: ['unbind', 'unset'],
            type: this.botCommandType.unbind,
            argsInfo: '无参数',
            args: ['orgArgs', 'useless'],
            argsFromUserInfo: [false, false],
            reg: /^(.*)/i,
            note: ""
        }, {
            info: '设置默认mode',
            command: ['mode'],
            type: this.botCommandType.mode,
            argsInfo: '(mode)',
            args: ['orgArgs', 'm'],
            argsFromUserInfo: [false, false],
            reg: /^(.+)/i,
            note: ""
        }
    ]
}


module.exports = CommandsInfo;