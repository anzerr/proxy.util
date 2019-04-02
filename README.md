
### `Intro`
proxy request to a server transforming the headers or url

#### `Install`
``` bash
npm install --save git+https://git@github.com/anzerr/proxy.util.git
```

### `Example`
``` javascript
const Proxy = require('proxy.util'),
	{Server} = require('http.server');

let proxy = new Proxy('https://www.google.com'),
	http = new Server(8080);

proxy.on('request', (req) => {
	console.log('forward url', req.url);
	req.done();
});

http.create((req, res) => {
	proxy.forward(req._req, res._res).catch((e) => {
		res.status(500).send(e.toString());
	});
}).then(() => {
	console.log('started server on port', 8080);
});
```