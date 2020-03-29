"use strict";

const querystring = require('querystring');
const https = require('https');

class RippleApi {
    static apiRequest(options) {
        return new Promise((resolve, reject) => {
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

            console.log("发送请求：" + requestOptions.host + requestOptions.path);

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

    static async apiCall(_path, _data, _host) {
        return await this.apiRequest({
            path: _path,
            data: _data,
            host: _host
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

    //判断字符串是否为正整数
    static checkInt(nubmer) {
        var re = /^\d+$/;
        return (re.test(nubmer));
    }

    static setIdOrName(options, data = {}) {
        const u = options.u;
        const type = options.type;
        if (type) {
            if (type == 'string') { data.name = u; return data; }
            if (type == 'id') { data.id = u; return data; }
        }
        if (this.checkInt(u)) { data.id = u; return data; }
        else { data.name = u; return data; }
    }

    static async getPing(host) {
        const resp = await this.apiCall('/ping', null, host);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    static async getUsers(options, host) {
        let data = this.setIdOrName(options);
        const resp = await this.apiCall('/users', data, host);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    static async getUsersFull(options, host) {
        let data = this.setIdOrName(options);
        const resp = await this.apiCall('/users/full', data, host);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    static async getUsersFullRx(options, host) {
        let data = this.setIdOrName(options);
        const resp = await this.apiCall('/users/rxfull', data, host);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    static async getUserId(options, host) {
        let data = { name: options.u };
        const resp = await this.apiCall('/whatid', data, host);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    static async getRecent(options, host) {
        let data = this.setIdOrName(options);
        if (options.limit) data.l = options.limit;
        if (options.m) data.mode = options.m;
        const resp = await this.apiCall('/users/scores/recent', data, host);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    static async getRecentRx(options, host) {
        let data = this.setIdOrName(options);
        if (options.limit) data.l = options.limit;
        if (options.m) data.mode = options.m;
        const resp = await this.apiCall('/users/scores/rxrecent', data, host);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    static async getBests(options, host) {
        let data = this.setIdOrName(options);
        if (options.limit) data.l = options.limit;
        if (options.m) data.mode = options.m;
        const resp = await this.apiCall('/users/scores/best', data, host);
        return resp;
    }

	/**
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    static async getBestsRx(options, host) {
        let data = this.setIdOrName(options);
        if (options.limit) data.l = options.limit;
        if (options.m) data.mode = options.m;
        const resp = await this.apiCall('/users/scores/rxbest', data, host);
        return resp;
    }

	/**
     * 暂不支持查relax成绩！！
	 * @param {Object} options apiOptions格式（osu api参数格式）
	 * @returns {Promise<Object>} The response body
	 */
    static async getScores(options, host) {
        // 没法查指定人，u用不着了
        let data = {};
        if (options.b) data.b = options.b;
        if (options.limit) data.l = options.limit;
        if (options.m) data.mode = options.m;
        const resp = await this.apiCall('/scores', data, host);
        return resp;
    }

}

module.exports = RippleApi;
