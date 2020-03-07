const utils = require("../utils");

class RippleBeatmapObject {
    constructor(beatmap) {
        this.beatmapId = beatmap.beatmap_id;
        this.beatmapSetId = beatmap.beatmapset_id;
        // this.mode = parseInt(beatmap.mode);
        // this.beatmapMode = utils.getModeString(beatmap.mode);
        // this.artist = beatmap.artist;
        // this.title = beatmap.title;
        // this.creator = beatmap.creator;
        this.songName = beatmap.song_name;
        // this.diff = beatmap.version;
        // this.approved = utils.getApprovedString(beatmap.approved);
        this.ranked = utils.getRippleRankedString(beatmap.ranked);

        // this.bpm = beatmap.bpm;
        this.length = utils.gethitLengthString(beatmap.hit_length);
        this.maxCombo = beatmap.max_combo;
        // this.cs = beatmap.diff_size;
        this.ar = beatmap.diff_approach;
        this.od = beatmap.diff_overall;
        // this.hp = beatmap.diff_drain;
        this.difficulty = beatmap.difficulty;
        this.difficulty2 = beatmap.difficulty2;
    }

    toString() {
        let output = "";

        output = output + "谱面 " + this.beatmapId + " " + this.songName + "\n";
        output = output + "set： " + this.beatmapSetId + " 状态： " + this.ranked + "\n";
        output = output + "AR" + this.ar + "  OD" + this.od + "\n";
        if (this.difficulty2.std > 0) output = output + "std： " + this.difficulty2.std + "★  ";
        if (this.difficulty2.taiko > 0) output = output + "taiko： " + this.difficulty2.taiko + "★  ";
        if (this.difficulty2.ctb > 0) output = output + "ctb： " + this.difficulty2.ctb + "★  ";
        if (this.difficulty2.mania > 0) output = output + "mania： " + this.difficulty2.mania + "★  ";
        output = output + "\n";
        output = output + "max Combo： " + this.maxCombo + "  时长： " + this.length + "\n";

        output = output + "\n";
        output = output + "http://osu.ppy.sh/b/" + this.beatmapId;
        return output;
    }

    toScoreTitle(scoreModeString = this.beatmapMode) {
        return "谱面 " + this.beatmapId + " " + this.songName + " 的" + scoreModeString + "成绩：\n";
    }
}

module.exports = RippleBeatmapObject;