
class Headers extends require('./hook.js') {

	constructor(headers, status) {
		super();
		this._data = {headers: headers, status: status};
	}

	set headers(u) {
		for (let i in u) {
			this._data.headers[i] = u[i];
		}
	}

	get headers() {
		return this._data.headers;
	}

	set status(u) {
		this._data.status = u;
	}

	get status() {
		return this._data.status;
	}

}

module.exports = Headers;
