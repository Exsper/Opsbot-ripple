function CommandsInfo(prefix, prefix2) {
    this.prefix = prefix; // 默认为*
    this.prefix2 = prefix2; // 默认为%
    this.help = {
        args: "[]中的参数为必要参数，()中的参数为可选参数\n",
        userName: "绑定后username可以直接省略，纯数字id可以尝试在名字前后加上\"号\n"
    };
    this.commandReg = /^([a-zA-Z]+)/i // 去除prefix后截取指令部分
    this.regs = {
        beatmapString: /^([^+＋:：#＃|｜/／“”'"]+)/i,
        userStringWithBeatmap: /[|｜]([^+＋:：#＃|｜]+)/i, // 前面有beatmap时取user
        userStringWithoutBeatmap: /^([^+＋:：#＃|｜]+)/i, // 前面没有beatmap时取user
        modsString: /[+＋]([a-zA-Z0-9]+)/i,
        modeString: /[:：]([^+＋:：#＃|｜/／“”'"]+)/i,
        limitString: /[#＃]([0-9]+)/i,
        noarg: undefined  // 不需要使用正则判断，参数格式简单或特殊参数
    };
    this.commands = [
        {
            key: "beatmap",
            info: '谱面查询',
            command: ['beatmap', 'search', 'b', 'map'],
            argsInfo: '[beatmap] (+mods) (:mode)',
            args: ['beatmapString', 'modsString', 'modeString'],
            argNecessity: [1, -1, -1],    // 1：必须直接提供 0：user和mods，必须提供，省略时从存储中寻找 -1：可省略
        }, {
            info: '玩家查询',
            command: ['stat', 'statme', 'u', 'user', 'p', 'player'],
            argsInfo: '(user) (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [0, -1], 
        }, {
            info: '玩家查询（relax模式）',
            command: ['statrx', 'statmerx', 'urx', 'userrx', 'prx', 'playerrx'],
            argsInfo: '(user) (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [0, -1], 
        }, {
            info: '自己谱面成绩查询',
            command: ['me'],
            type: "成绩",
            argsInfo: '[beatmap] (+mods) (:mode)',
            args: ['beatmapString', 'modsString', 'modeString'],
            argNecessity: [1, -1, -1],
        }, {
            info: '自己谱面成绩查询（relax模式）',
            command: ['merx'],
            type: "成绩",
            argsInfo: '[beatmap] (+mods) (:mode)',
            args: ['beatmapString', 'modsString', 'modeString'],
            argNecessity: [1, -1, -1],
        }, {
            info: '指定玩家谱面成绩查询',
            command: ['s', 'score'],
            type: "成绩",
            argsInfo: '[beatmap] | [user] (+mods) (:mode)',
            args: ['beatmapString', 'userStringWithBeatmap', 'modsString', 'modeString'],
            argNecessity: [1, 1, -1, -1],
        }, {
            info: '指定玩家谱面成绩查询（relax模式）',
            command: ['srx', 'scorerx'],
            type: "成绩",
            argsInfo: '[beatmap] | [user] (+mods) (:mode)',
            args: ['beatmapString', 'userStringWithBeatmap', 'modsString', 'modeString'],
            argNecessity: [1, 1, -1, -1],
        }, {
            info: '谱面最高成绩查询',
            command: ['t', 'top'],
            type: "成绩",
            argsInfo: '[beatmap] (+mods) (:mode)',
            args: ['beatmapString', 'modsString', 'modeString'],
            argNecessity: [1, -1, -1],
        }, {
            info: '谱面最高成绩查询（relax模式）',
            command: ['trx', 'toprx'],
            type: "成绩",
            argsInfo: '[beatmap] (+mods) (:mode)',
            args: ['beatmapString', 'modsString', 'modeString'],
            argNecessity: [1, -1, -1],
        }, {
            info: '谱面成绩与最高成绩比较',
            command: ['vstop', 'topvs'],
            type: "成绩",
            argsInfo: '[beatmap] (+mods) (:mode)',
            args: ['beatmapString', 'modsString', 'modeString'],
            argNecessity: [1, -1, -1],
        }, {
            info: '谱面成绩与最高成绩比较（relax模式）',
            command: ['vstoprx', 'topvsrx'],
            type: "成绩",
            argsInfo: '[beatmap] (+mods) (:mode)',
            args: ['beatmapString', 'modsString', 'modeString'],
            argNecessity: [1, -1, -1],
        }, {
            info: 'bp成绩查询（省略#number则输出bp5）',
            command: ['bp', 'best', 'bbp', 'bests', 'mybp', 'bpme'],
            argsInfo: '(user) (#number) (:mode)',
            args: ['userStringWithoutBeatmap', 'limitString', 'modeString'],
            argNecessity: [0, -1, -1],
        }, {
            info: 'bp成绩查询（省略#number则输出bp5）（relax模式）',
            command: ['bprx', 'bestrx', 'bbprx', 'bestsrx', 'mybprx', 'bpmerx'],
            argsInfo: '(user) (#number) (:mode)',
            args: ['userStringWithoutBeatmap', 'limitString', 'modeString'],
            argNecessity: [0, -1, -1],
        }, {
            info: '获取最近成绩（包括未pass成绩）',
            command: ['r', 'rct', 'rctpp', 'recent'],
            argsInfo: '(user) (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [0, -1],
        }, {
            info: '获取最近成绩（包括未pass成绩）（relax模式）',
            command: ['rrx', 'rctrx', 'rctpprx', 'recentrx'],
            argsInfo: '(user) (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [0, -1],
        }, {
            info: '获取最近成绩（不包括未pass成绩）',
            command: ['pr', 'prsb'],
            argsInfo: '(user) (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [0, -1],
        }, {
            info: '获取最近成绩（不包括未pass成绩）（relax模式）',
            command: ['prrx'],
            argsInfo: '(user) (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [0, -1],
        }, {
            info: '绑定osu账号',
            command: ['bind', 'set', 'setid'],
            argsInfo: '[user] (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [1, -1],
        }, {
            info: '解绑osu账号',
            command: ['unbind', 'unset', 'unsetid'],
            argsInfo: '无参数',
            args: [],
            argNecessity: [],
        }, {
            info: '设置默认mode',
            command: ['mode'],
            argsInfo: '[mode]',
            args: ['noarg'],
            argNecessity: [1],
        }
    ]
}


module.exports = CommandsInfo;