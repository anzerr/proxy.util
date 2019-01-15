
class Hook {

	constructor() {
		this._promise = new Promise((resolve) => {
			this._resolve = resolve;
		});
	}

	done() {
		this._resolve(this._data);
		return this;
	}

	finished() {
		return this._promise;
	}

}

module.exports = Hook;
