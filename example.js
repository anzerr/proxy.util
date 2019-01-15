
const Proxy = require('./index.js'),
	{Server} = require('http.server');

let proxy = new Proxy('https://www.google.com'),
	http = new Server(8080);

proxy.on('request', (req) => {
	console.log('forward url', req.url);
	req.done();
});

proxy.on('header', (res) => {
	console.log('header url', res.requestHeaders, res.status, res.headers);
	res.headers.server = 'proxy';
	res.done();
});

http.create((req, res) => {
	proxy.forward(req._req, res._res).catch((e) => {
		res.status(500).send(e.toString());
	});
}).then(() => {
	console.log('started server on port', 8080);
});
