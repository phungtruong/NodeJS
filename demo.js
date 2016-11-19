var async = require('async');
var mysql = require('mysql');
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
server.listen(process.env.PORT || 5555);
app.get('/', function(req,res){
	var start = req.query.start;
	var IDuser = 39;
	listFriend( 39, start , function(result){
		sortList(result, function(arr){
			res.json(arr);
		});
	});
});

function compare(a,b) {
  if (a._ID < b._ID)
    return -1;
  if (a._ID > b._ID)
    return 1;
  return 0;
}

function sortList(arr, callback)
{
	callback(arr.sort(compare));
}

function getIdRoom(manguser,callback)
{
	var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "usermanage"
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		tachMangUserThanhChuoi(manguser, function(chuoi){
			con.query('SELECT _IDRoom FROM roomdetail WHERE _IDuser IN '+chuoi+' GROUP BY _IDRoom HAVING Count(DISTINCT _IDuser) = ?',[manguser.length], function(err, rows){
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows[0]._IDRoom);
			con.end();
			});
		});
	});
}

function tachMangUserThanhChuoi(manguser, callback)
{
	var chuoi = "";
	for (var i=0 ; i < manguser.length ; i++)
	{
		if (i != manguser.length - 1)
			chuoi += manguser[i] + ","
		else
			chuoi += manguser[i];
	}
	chuoi = '(' + chuoi + ')';
	callback(chuoi);
}

function listFriend(IDuser,start,back)
{
	var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "usermanage"
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT us._ID,us.name, us.avatar FROM userfriend uf, user us WHERE uf._IDuser = ? and uf._IDFriend = us._ID LIMIT '+ start+',10',[IDuser], function(err, rows){
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			var arr = [];
			if (rows.length > 0)
			{
				async.forEach(rows, function (item, callback){
					test(IDuser, item, function(friend){
						console.log(friend._ID+'');
						arr.push(friend);
						callback();
					});

					}, function(err) {
					back(arr);
					con.end();
				});
			}
			else
			{
				back(arr);
				con.end();
			}
		});
	});
}
function run(start, callback){
	getLastMessageInRoom(start, function(result){
	var arr = [];
	async.each(result, function(item, callback){
	var object = {
		_ID : item._ID,
		message : item.Message,
	};
	arr.push(object);
	callback();
}, function(err){
	var json = JSON.stringify(arr);
	callback(json);
});
});
}

function test(IDuser, item, callback){
	var manguser = [IDuser, item._ID];
					var _ID = item._ID;
					var name = item.name;
					var avatar = item.avatar;
					getIdRoom(manguser, function(_IDRoom){
					var friend = {
						_ID     : _ID,
						name    : name,
						avatar  : avatar,
						_IDRoom : _IDRoom
					};
					callback(friend);
					});
}
