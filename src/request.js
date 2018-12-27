
class Request {

	constructor(option) {
		this._option = option;
		this._promise = new Promise((resolve) => {
			this._resolve = resolve;
		});
	}

	set url(u) {
		this._option.path = u;
	}

	get url() {
		return this._option.path;
	}

	done() {
		this._resolve(this._option);
		return this;
	}

	finished() {
		return this._promise;
	}

}

module.exports = Request;
