
const Proxy = require('./index.js'),
	{Server} = require('http.server');

let proxy = new Proxy('https://www.google.com', (url) => {
		return url;
	}),
	http = new Server(8080);

http.create((req, res) => {
	proxy.handle(req._req, res._res);
}).then(() => {
	console.log('started server on port', 8080);
});
