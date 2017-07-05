var name;
var password;
var username;
var topics;
var result;
var currentUser;

var WebSocketServer = require('ws').Server;

wss = new WebSocketServer({port: 9090, path: '/server'});

wss.on('connection', function(ws) {

	ws.on('message', function(message) {

		var msg = message.split(":");

		if(msg[0] == 'login'){
			// comandos do login
			username = msg[1];
			password = msg[2];

		}else{
			//comandos save
			name = msg[1];
			username = msg[2];
			password = msg[3];
			topics = msg[4];
		}
});

console.log('new connection');
ws.send('Msg from server');

});