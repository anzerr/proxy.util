'use strict';

const https = require('https'),
	http = require('http'),
	url = require('url'),
	clone = require('clone.util'),
	Request = require('./src/request.js'),
	Headers = require('./src/headers.js');

class Proxy extends require('events') {

	constructor(uri) {
		super();
		this.host = (uri.match(/^https*\:\/\//)) ? uri : 'http://' + uri;
		this.url = url.parse(this.host);
		this.isHttps = (this.url.protocol === 'https:');
		this._headers = {};
	}

	hooked(event, e) {
		if (this.listenerCount(event) === 0) {
			e.done();
		} else {
			this.emit(event, e);
		}
		return e;
	}

	forward(req, res) {
		let format = new Request(clone({
			method: req.method,
			hostname: this.url.hostname,
			port: this.url.port || (this.isHttps ? 443 : 80),
			path: req.url,
			headers: req.headers
		}));
		return this.hooked('request', format).finished().then((option) => {
			return new Promise((resolve, reject) => {
				option.headers.host = this.url.host;
				let proxy = (this.isHttps ? https : http).request(option, (r) => {
					let header = this.hooked('header', new Headers(req.headers, r.headers, r.statusCode));
					header.finished().then(() => {
						res.writeHead(header.status, header.headers);
						r.pipe(res);
					}).catch(reject);
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
