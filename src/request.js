
class Request extends require('./hook.js') {

	constructor(data) {
		super();
		this._data = data;
	}

	set url(u) {
		this._data.path = u;
	}

	get url() {
		return this._data.path;
	}

}

module.exports = Request;
