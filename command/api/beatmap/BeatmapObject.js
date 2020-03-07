const utils = require("../utils");

class BeatmapObject {
    constructor(beatmap) {
        this.beatmapId = beatmap.beatmap_id;
        this.beatmapSetId = beatmap.beatmapset_id;
        this.mode = parseInt(beatmap.mode);
        this.beatmapMode = utils.getModeString(beatmap.mode);
        this.artist = beatmap.artist;
        this.title = beatmap.title;
        // this.creator = beatmap.creator; ppy.sb为空值
        this.diff = beatmap.version;
        this.approved = utils.getApprovedString(beatmap.approved);

        this.bpm = beatmap.bpm;
        this.length = beatmap.hit_length;
        this.maxCombo = beatmap.max_combo;
        this.cs = beatmap.diff_size;
        this.ar = beatmap.diff_approach;
        this.od = beatmap.diff_overall;
        this.hp = beatmap.diff_drain;
        this.stars = beatmap.difficultyrating;
    }

    toString() {
        let output = "";

        output = output + "谱面 " + this.beatmapId + " " + this.artist + " - " + this.title + "[" + this.diff + "] " + "\n";
        output = output + "set： " + this.beatmapSetId + " 模式： " + this.beatmapMode + " 状态： " + this.approved + "\n";
        output = output + "CS" + this.cs + "  AR" + this.ar + "  OD" + this.od + "  HP" + this.hp + "  BPM: " + this.bpm + " stars: " + this.stars + "\n";
        output = output + "max Combo： " + this.maxCombo + "\n";

        output = output + "\n";
        output = output + "http://osu.ppy.sh/b/" + this.beatmapId;
        return output;
    }

    toScoreTitle(scoreModeString = this.beatmapMode) {
        return "谱面 " + this.beatmapId + " " + this.artist + " - " + this.title + "[" + this.diff + "] " + " 的" + scoreModeString + "成绩：\n";
    }
}

module.exports = BeatmapObject;