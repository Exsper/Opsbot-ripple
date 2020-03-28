"use strict";

const BeatmapObject = require("./objects/BeatmapObject");
const OsuApi = require("./ApiRequest");

class getBeatmapData {
    constructor(host, apiObjects) {
        this.host = host;
        this.apiObject = apiObjects[0]; // 只允许同时查一张谱面
    }

    async getBeatmapObject(argObject) {
        const beatmaps = await OsuApi.getBeatmaps(argObject, this.host);
        if (beatmaps.code === 404) return "找不到谱面 " + JSON.stringify(argObject) + "\n";
        if (beatmaps.code === "error") return "获取谱面出错 " + JSON.stringify(argObject) + "\n";
        if (beatmaps.length <= 0) return "找不到谱面 " + JSON.stringify(argObject) + "\n";
        return new BeatmapObject(beatmaps[0]);
    }

    async outputBeatmap(argObject) {
        let beatmapObject = await this.getBeatmapObject(argObject);
        return beatmapObject.toString();
    }
}


module.exports = getBeatmapData;