
// 只在beatmap指令用，其他指令需要获取谱面时还是用osu api
class CheeseGullApi {
    apiRequest(options) {
        return new Promise((resolve, reject) => {
            const querystring = require('querystring');
            const contents = (options.data) ? querystring.stringify(options.data) : "";
            const requestOptions = {
                host: 'storage.ripple.moe',
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
            data: _data
        }).then(data => {
            try {
                if (!data || data === "null") return { code: "404" };
                return JSON.parse(data);
            }
            catch (ex) {
                console.log(ex);
                return { code: "error" };
            }
        });
    }
	/**
	 * @param {Object} options
	 * @param {String} [options.amount] amount of results to return. Defaults to 50. Can be a value from 1 to 100.
	 * @param {String} [options.offset] offset of the results. In a classic pagination system, this would be amount * (page - 1), assuming page starts from 1.
	 * @param {String} [options.status] beatmap ranked status. If not passed, all statuses are good. Multiple statuses can be passed to specify that multiple statuses are accepted.
	 * @param {String} [options.mode] game mode. If not passed, all game modes are good. Multiple game modes can be passed - for instance, you can pass 1 and 3, and only sets that have both taiko and mania beatmaps will be shown.
	 * @param {String} [options.query] the search query.
	 * @returns {Promise<Object>} The response body
	 */
    async search(options) {
        const resp = await this.apiCall('/search', options);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    async getBeatmap(options) {
        const beatmapId = options.b;
        const resp = await this.apiCall('/b/' + beatmapId);
        return resp;
    }
}

module.exports = CheeseGullApi;
