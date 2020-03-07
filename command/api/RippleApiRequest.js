
// 只用到recent和best/rxrecent和rxbest
class RippleApi {
    constructor(host) {
        this.host = host || 'osu.ppy.sb';
    }

    apiRequest(options) {
        return new Promise((resolve, reject) => {
            const querystring = require('querystring');
            const contents = (options.data) ? querystring.stringify(options.data) : "";
            const requestOptions = {
                host: options.host,
                port: 443,
                type: 'https',
                method: 'GET',
                path: '/api/v1' + options.path + '?' + contents,
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
                if (!data || data === "null") return { code: "404" };
                return JSON.parse(data);
            }
            catch (ex) {
                console.log(ex);
                return { code: "error" };
            }
        });
    }

    //判断字符串是否为正整数
    checkInt(nubmer) {
        var re = /^\d+$/;
        return (re.test(nubmer));
    }

    setIdOrName(options, data = {}) {
        const u = options.u;
        const type = options.type;
        if (type) {
            if (type == 'string') { data.name = u; return data; }
            if (type == 'id') { data.id = u; return data; }
        }
        if (this.checkInt(u)) { data.id = u; return data; }
        else { data.name = u; return data; }
    }

    async getPing() {
        const resp = await this.apiCall('/ping');
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    async getUsers(options) {
        let data = this.setIdOrName(options);
        const resp = await this.apiCall('/users', data);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    async getUsersFull(options) {
        let data = this.setIdOrName(options);
        const resp = await this.apiCall('/users/full', data);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    async getUserId(options) {
        let data = { name: options.u };
        const resp = await this.apiCall('/whatid', data);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    async getRecent(options) {
        let data = this.setIdOrName(options);
        if (options.limit) data.l = options.limit;
        if (options.m) data.mode = options.m;
        const resp = await this.apiCall('/users/scores/recent', data);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    async getRecentRx(options) {
        let data = this.setIdOrName(options);
        if (options.limit) data.l = options.limit;
        if (options.m) data.mode = options.m;
        const resp = await this.apiCall('/users/scores/rxrecent', data);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    async getBests(options) {
        let data = this.setIdOrName(options);
        if (options.limit) data.l = options.limit;
        if (options.m) data.mode = options.m;
        const resp = await this.apiCall('/users/scores/best', data);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    async getBestsRx(options) {
        let data = this.setIdOrName(options);
        if (options.limit) data.l = options.limit;
        if (options.m) data.mode = options.m;
        const resp = await this.apiCall('/users/scores/rxbest', data);
        return resp;
    }

}

module.exports = RippleApi;
