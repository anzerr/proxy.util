'use strict';

const https = require('https'),
	http = require('http'),
	url = require('url');

class Proxy {

	constructor(u, format) {
		let base = u;
		if (!base.match(/^https*\:\/\//)) {
			base = 'http://' + base;
		}
		this.host = base;
		this.format = format;
		this.url = url.parse(base);
		this._headers = {};
		this._options = {};
		this.data = {
			value: '',
			type: null
		};
	}

	handle(req, res) {
		const isHttps = (this.url.protocol === 'https:'), option = {
			method: req.method,
			hostname: this.url.hostname,
			port: this.url.port || (isHttps ? 443 : 80),
			path: this.format(req.url),
			headers: req.headers
		};
		option.headers.host = this.url.host;

		let proxy = (isHttps ? https : http).request(option, (r) => {
			res.writeHead(r.statusCode, r.headers);
			r.pipe(res);
		});
		req.pipe(proxy);
	}

}

module.exports = Proxy;
