var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var mysql = require('mysql');
var async = require('async');
var connect = require('connect');

var db_host = 'sql6.freemysqlhosting.net';
var db_username = 'sql6155240';
var db_password = 'GGINPQBYdS';
var db_name = 'sql6155240';
var db_timeout = 10000000;
/*
var db_host = 'localhost';
var db_username = 'root';
var db_password = '';
var db_name = 'usermanage';
var db_timeout = 10000000;
*/
app.use(express.static(__dirname + '/public'));
app.use(connect.cookieParser());
app.use(connect.logger('dev'));
app.use(connect.bodyParser());
app.use(connect.json());
app.use(connect.urlencoded());
//app.use(bodyParser.json()); // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//set up server
server.listen(process.env.PORT || 7777);
//get the request
app.get('/', function(req,res){
	res.end('NODEJS COMPLETE');
});

app.get('/test', function(req,res){
	getUser(function(result){
		res.end(JSON.stringify(result));
	});
});

function getUser(callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err) {
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT * FROM user LIMIT 10', function(err, rows){
    		con.end();
    		if (err) throw err;
			callback(rows);
  		});
	});
}