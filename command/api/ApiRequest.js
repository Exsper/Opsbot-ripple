

class OsuApi {
    constructor(host) {
        this.host = host || 'osu.ppy.sb';
    }

    apiRequest(options) {
        return new Promise((resolve, reject) => {
            const querystring = require('querystring');
            const contents = querystring.stringify(options.data);
            const requestOptions = {
                host: options.host,
                port: 443,
                type: 'https',
                method: 'GET',
                path: '/api' + options.path + '?' + contents,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': contents.length
                }
            }
            let _data = '';
            const https = require('https');
            const req = https.request(requestOptions, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    _data += chunk;
                });
                res.on('end', function () {
                    resolve(_data);
                });
                res.on('error', function (e) {
                    console.dir('problem with request: ' + e.message);
                    reject(e)
                });
            });
            req.write(contents);
            req.end();
        })
    }

    async apiCall(_path, _data) {
        return await this.apiRequest({
            path: _path,
            data: _data,
            host: this.host
        }).then(data => {
            try {
                if (!data || data === "null") return { code: 404 };
                return JSON.parse(data);
            }
            catch (ex) {
                console.log(ex);
                return { code: "error" };
            }
        });
    }

    async getBeatmaps(options) {
        const resp = await this.apiCall('/get_beatmaps', options);
        return resp;
    }

    async getUser(options) {
        const resp = await this.apiCall('/get_user', options);
        return resp;
    }

    async getScores(options) {
        const resp = await this.apiCall('/get_scores', options);
        return resp;
    }

    async getUserBest(options) {
        const resp = await this.apiCall('/get_user_best', options);
        return resp;
    }

    async getUserRecent(options) {
        const resp = await this.apiCall('/get_user_recent', options);
        return resp;
    }

    async getUserRecentRx(options) {
        const resp = await this.apiCall('/get_user_rxrecent', options);
        return resp;
    }
}

module.exports = OsuApi;
