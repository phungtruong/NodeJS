var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io')(server);
//set up server
server.listen(process.env.PORT || 7777);
//get the request
app.get('/', function(req,res){
	res.send('Hello World');
});

//socket io listen a connection event
socketio.on('connection',function(socket){
	console.log('Co nguoi ket noi');
	socket.on('client-gui-tin-nhan',function(message){
		socketio.emit('server-gui-tin-nhan',{"username": socket.un, "message":message});
	});
	socket.on('client-gui-username',function(username){
		socket.un = username;
	});
});
