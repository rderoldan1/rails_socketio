var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var redis = require('redis');
var client = require('redis').createClient();
var subscribe = require('redis').createClient();
var winston = require('winston');

app.listen(8080);

function handler (req, res) {
	fs.readFile(__dirname + '/index.html',
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}

			res.writeHead(200);
			res.end(data);
		});
}

io.on('connection', function (socket) {
	winston.info('New connection');

	// Subscribe to Redis PubSub channel
	subscribe.subscribe('ChatChannel');

	socket.on('send', function (data) {
		console.log(data);
	});

	var callback = function (channel, data) {
		winston.info('New event: ' + data);
		socket.emit('message', data);
	};

	// when new 'message' is published in Redis PubSub channel it is send
	// to the clients connected via WebSockets.
	subscribe.on('message', callback);

	// Handle disconnect
	socket.on('disconnect', function () {
		winston.info('Drop connection');
		subscribe.removeListener('message', callback);
	});
});