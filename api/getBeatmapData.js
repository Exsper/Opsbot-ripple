"use strict";

const BeatmapObject = require("./objects/BeatmapObject");
const OsuApi = require("./ApiRequest");

class getBeatmapData {
    constructor(host, apiObjects) {
        this.host = host;
        this.apiObject = (Array.isArray(apiObjects)) ? apiObjects[0] : apiObjects; // 只允许同时查一张谱面
    }

    async getBeatmapObject() {
        const beatmaps = await OsuApi.getBeatmaps(this.apiObject, this.host);
        if (beatmaps.code === 404) throw "找不到谱面 " + JSON.stringify(this.apiObject);
        if (beatmaps.code === "error") throw "获取谱面出错 " + JSON.stringify(this.apiObject);
        if (beatmaps.length <= 0) throw "找不到谱面 " + JSON.stringify(this.apiObject);
        return new BeatmapObject(beatmaps[0], false);
    }

    async output() {
        try {
            let beatmapObject = await this.getBeatmapObject();
            return beatmapObject.toString();
        }
        catch (ex) {
            return ex;
        }
    }
}


module.exports = getBeatmapData;