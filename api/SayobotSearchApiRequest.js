"use strict";

const https = require('https');

class SayobotSearchApi {
    static apiRequest(beatmap_id) {
        const url = "https://api.sayobot.cn/v2/beatmapinfo?0=" + beatmap_id;
        return new Promise((resolve, reject) => {
            let _data = '';

            // console.log("发送请求：" + requestOptions.host + requestOptions.path);

            const req = https.get(url, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    _data += chunk;
                });
                res.on('end', function () {
                    resolve(_data);
                });
                res.on('error', function (e) {
                    console.dir('problem with request: ' + e.message);
                    reject(e);
                });
            });
            req.end();
        })
    }

    static async getBeatmapInfo(beatmap_id) {
        return await this.apiRequest(beatmap_id).then(data => {
            try {
                if (!data) return { code: 404 };
                let result = JSON.parse(data);
                if (result.status === -1) return { code: 404 };
                // sayobot返回的是整个set的信息，需要找出我们要的谱面
                if (!result.data.bid_data || result.data.bid_data.length <= 0) return { code: 404 };
                let beatmapInfos = result.data.bid_data;
                let beatmapInfo = beatmapInfos.find((b) => (b.bid === parseInt(beatmap_id)));
                if (!beatmapInfo) return { code: 404 };
                return beatmapInfo;
            }
            catch (ex) {
                console.log(ex);
                return { code: "error" };
            }
        });
    }



}

module.exports = SayobotSearchApi;
