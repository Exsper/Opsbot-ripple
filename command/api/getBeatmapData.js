const BeatmapObject = require("./objects/BeatmapObject");


class getBeatmapData {
    async getBeatmapObject(osuApi, argObject) {
        const beatmaps = await osuApi.getBeatmaps(argObject);
        if (beatmaps.code === "404") return "找不到谱面 " + JSON.stringify(argObject) + "\n";
        if (beatmaps.code === "error") return "获取谱面出错 " + JSON.stringify(argObject) + "\n";
        if (beatmaps.length <= 0) return "找不到谱面 " + JSON.stringify(argObject) + "\n";
        return new BeatmapObject(beatmaps[0]);
    }

    async outputBeatmap(osuApi, argObject) {
        let beatmapObject = await this.getBeatmapObject(osuApi, argObject);
        return beatmapObject.toString();
    }
}


module.exports = getBeatmapData;