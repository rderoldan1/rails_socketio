var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var redis = require('redis');
var client = require('redis').createClient();
var subscribe = require('redis').createClient();

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

	subscribe.subscribe('ChatChannel');

	socket.on('send', function (data) {
		//client.publish('ChatChannel', data.message);
		console.log(data);
	});

	var callback = function (channel, data) {
		socket.emit('message', data);
	};
	subscribe.on('message', callback);

	// Handle disconnect
	socket.on('disconnect', function () {
		subscribe.removeListener('message', callback);
	});
});