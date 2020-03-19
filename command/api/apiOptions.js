const utils = require('./utils');

class apiOptions {
    constructor(beatmap, user, limit, mods, mode) {
        this.beatmap = beatmap;
        this.user = user;
        this.limit = limit;
        this.mods = mods;
        this.mode = mode;
    }

    getOneArgObject(singlebeatmap, singleuser, singlelimit, singlemods, singlemode) {
        let argObject = {};
        if (singlebeatmap) argObject.b = singlebeatmap;
        if (singleuser) {
            if ((singleuser.length > 4) && (singleuser.substring(0, 1) === "\"") && (singleuser.substring(singleuser.length - 1) === "\"")) {
                // 带引号强制字符串形式
                argObject.u = singleuser.substring(1, singleuser.length - 1);
                argObject.type = 'string';
            }
            else {
                argObject.u = singleuser;
            }
        }
        if (singlelimit) argObject.limit = singlelimit;
        if (singlemods) argObject.mods = utils.getScoreMods(singlemods.toUpperCase()).toString();
        if (singlemode) argObject.m = utils.getMode(singlemode);
        return argObject;
    }

    getArgObjects() {
        let argObjects = [];
        // 没有user参数
        if (this.user.length <= 0) argObjects.push(this.getOneArgObject(this.beatmap, undefined, this.limit, this.mods, this.mode));
        else {

            this.user.forEach((singleuser) => {
                argObjects.push(this.getOneArgObject(this.beatmap, singleuser, this.limit, this.mods, this.mode));
            });
        }
        return argObjects;
    }

}


module.exports = apiOptions;