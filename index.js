'use strict';

const https = require('https'),
	http = require('http'),
	url = require('url'),
	Request = require('./src/request.js');

class Proxy extends require('events') {

	constructor(uri) {
		super();
		this.host = (uri.match(/^https*\:\/\//)) ? uri : 'http://' + uri;
		this.url = url.parse(this.host);
		this.isHttps = (this.url.protocol === 'https:');
		this._headers = {};
	}

	forward(req, res) {
		let format = new Request({
			method: req.method,
			hostname: this.url.hostname,
			port: this.url.port || (this.isHttps ? 443 : 80),
			path: req.url,
			headers: req.headers
		});
		this.emit('request', format);
		return format.finished().then((option) => {
			console.log('done');
			return new Promise((resolve, reject) => {
				option.headers.host = this.url.host;
				let proxy = (this.isHttps ? https : http).request(option, (r) => {
					res.writeHead(r.statusCode, r.headers);
					r.pipe(res);
					res.on('end', () => {
						resolve();
					}).on('error', (e) => {
						reject(e);
					});
				});
				proxy.on('error', (e) => {
					reject(e);
				});
				req.pipe(proxy);
			});
		});
	}

}

module.exports = Proxy;
