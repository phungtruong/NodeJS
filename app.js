var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io')(server);
var mysql = require('mysql');
var fs = require('fs');
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
	var IDuser = 39;
	getUser(IDuser, function(result){
		res.end(JSON.stringify(result));
	});
});

app.post('/is-User-Available', function(req, res){
	var email = req.body.email;
	isUserAvailable(email, function(result){
		var success = {
			success : result
		}
		res.end(JSON.stringify(success));
	});
});

app.post('/dang-ky', function(req, res){
	var taikhoan = {
			_ID          : 0,
			password     : req.body.password,
			name         : req.body.name,
			gender       : parseInt(req.body.gender),
			email        : req.body.email,
			avatar       : null,
			date_of_birth: req.body.birthday
	}
	themUser(taikhoan, function(result, email, password){
		var success = {
			success : result,
			email : email,
			password : password
		}
		res.end(JSON.stringify(success));
	});
});

app.post('/dang-nhap', function(req, res){
	var taikhoan = {
			email        : req.body.email,
			password     : req.body.password
	}
	dangNhapUser(taikhoan.email, taikhoan.password, function(result, id, name, avatar){
		var success = {
			success : result,
			_ID  : id,
			name : name,
			avatar : avatar
		}
		res.end(JSON.stringify(success));
	});
});

app.post('/get-user-seen-in-room', function(req, res){
	var IDuser = req.body.IDuser;
	var IDRoom = req.body.IDRoom;
	getAllUserSeenRoom(IDuser, IDRoom, function(rows){
		res.json(rows);
	});
});

app.post('/get-user', function(req, res){
	var IDuser = req.body.IDuser;
	getUser(IDuser, function(result){
		res.end(JSON.stringify(result));
	});
});

app.post('/request-friend', function(req, res){
	var request = {
			_IDrequest        : req.body.IDuser,
			_IDuser          : req.body.IDFriend,
	}
	requestFriend(request, function(result){
		var success = {
			success : result
		}
		res.end(JSON.stringify(success));
	});
});

app.post('/insert-friend', function(req, res){
	var idfriend = req.body.IDFriend;
    var iduser = req.body.IDuser;
	var name = req.body.name;
	var nameFriend = req.body.nameFriend;
	insertFriend(iduser, idfriend, name, nameFriend, function(result){
		var success = {
			success : result
		}
		res.end(JSON.stringify(success));
	});
});

app.post('/update-name', function(req, res){
	var name = req.body.name;
    var iduser = req.body.IDuser;
	
	updateNameUser(name, iduser, function(result){
		var success = {
			success : result
		}
		res.end(JSON.stringify(success));
	});
});

app.post('/update-gender', function(req, res){
	var gender = req.body.gender;
    var iduser = req.body.IDuser;
	
	updateGenderUser(gender, iduser, function(result){
		var success = {
			success : result
		}
		res.end(JSON.stringify(success));
	});
});

app.post('/update-password', function(req, res){
	var oldpassword = req.body.oldpassword;
	var newpassword = req.body.newpassword;
    var iduser = req.body.IDuser;
	
	updatePasswordUser(oldpassword, newpassword, iduser, function(result){
		var success = {
			success : result
		}
		res.end(JSON.stringify(success));
	});
});

app.post('/update-birthday', function(req, res){
	var birthday = req.body.birthday;
    var iduser = req.body.IDuser;
	
	updateBirthdayUser(birthday, iduser, function(result){
		var success = {
			success : result
		}
		res.end(JSON.stringify(success));
	});
});

app.post('/update-name', function(req, res){
	var name = req.body.name;
    var iduser = req.body.IDuser;
	
	updateNameUser(name, iduser, function(result){
		var success = {
			success : result
		}
		res.end(JSON.stringify(success));
	});
});

app.post('/add-friend-to-room', function(req, res){
	var IDRoom = req.body.IDRoom;
	var JsonMangUser = req.body.JsonMangUser;
	var nameGroup = req.body.nameGroup;
	var IDuser = req.body.IDuser;
	parseJSON(JsonMangUser, function(array){
		var manguser = array;
		addFriendToRoom(manguser, IDRoom, nameGroup, IDuser, function(result, type, RoomID){
		var success = {
			success : result,
			type : type,
			IDRoom : RoomID
		}
		res.end(JSON.stringify(success));
	});
	});
});

app.post('/create-new-room-group-chat', function(req, res){
	var JsonMangUser = req.body.JsonMangUser;
	var nameGroup = req.body.nameGroup;
	var IDuser = req.body.IDuser;
	parseJSON(JsonMangUser, function(array){
		var manguser = array;
		taoRoom(manguser, nameGroup, IDuser, function(result, id){
		var success = {
			success : result,
			IDRoom : id
		}
		res.end(JSON.stringify(success));
	});
	});
});

app.post('/list-request-friend', function(req, res){
    var iduser = req.body.IDuser;
	var start = req.body.start;
	listRequestFriend(iduser, start, function(result){
		res.json(result);
	});
});

app.post('/list-friend', function(req, res){
    var iduser = req.body.IDuser;
	var start = req.body.start;
	listFriend(iduser, start, function(result){
		sortListFriend(result, function(arr){
			res.json(arr);
		});
	});
});

app.post('/list-friend-online', function(req, res){
    var iduser = req.body.IDuser;
	var start = req.body.start;
	listFriendOnline(iduser, start, function(result){
		sortListFriend(result, function(arr){
			res.json(arr);
		});
	});
});

app.get('/list-friend-search', function(req, res){
    var iduser = req.query.IDuser;
	var start = req.query.start;
	var search = req.query.search;
	timKiemFriend(search, iduser, start, function(result){
		sortListFriend(result, function(arr){
			res.json(arr);
		});
	});
});

app.get('/list-group-search', function(req, res){
    var iduser = req.query.IDuser;
	var start = req.query.start;
	var search = req.query.search;
	timKiemGroup(search, iduser, start, function(result){
		res.json(result);
	});
});

app.get('/list-people-search', function(req, res){
    var iduser = req.query.IDuser;
	var start = req.query.start;
	var search = req.query.search;
	timKiemPeople(search, iduser, start, function(result){
		res.json(result);
	});
});

app.post('/list-all-room', function(req, res){
    var iduser = req.body.IDuser;
	var start = req.body.start;
	listAllRoom(iduser,start, function(listroom){
		sortListAllRoom(listroom, function(output){
			res.json(output);
		});
	});
});

app.post('/list-message-in-room', function(req, res){
    var IDRoom = req.body.IDRoom;
	var start = req.body.start;
	listMessageInRoom(IDRoom, start, function(result){
		res.json(result);
	});
});

app.post('/invite-list', function(req, res){
    var iduser = req.body.IDuser;
	var start = req.body.start;
	var idroom = req.body.IDRoom;
	inviteList(idroom ,iduser, start, function(result){
		res.json(result);
	});
});

app.post('/invite-list-to-create-new-room', function(req, res){
    var iduser = req.body.IDuser;
	var start = req.body.start;
	var idroom = req.body.IDRoom;
	inviteListToCreateNewRoom(idroom ,iduser, start, function(result){
		res.json(result);
	});
});

app.post('/test-relationship', function(req, res){
	var idfriend = req.body.IDFriend;
    var iduser = req.body.IDuser;
	testRelationship(iduser, idfriend, function(result){
		var output = {
			result : result
		}
		res.end(JSON.stringify(output));
	});
});

app.get('/search-user', function(req,res){
	var search = req.query.search;
	var start = req.query.start;
	var IDuser = req.query.IDuser;
	timKiemUser(search,IDuser,start, function(ListUser){
		res.json(ListUser);
		/*
		sortListAllRoomTwo(arrRoom, function(arrNewRoom){
			sortListFriend(arrFriend, function(arrNewFriend){
				sortListFriend(arrRequest, function(arrNewRequest){
					sortListFriend(arrAccept, function(arrNewAccept){
						sortListFriend(arrNone, function(arrNewNone){
							var outputArray = arrNewRoom.concat(arrNewFriend).concat(arrNewRequest).concat(arrNewAccept).concat(arrNewNone);
							listAllRoomPage(outputArray, start, function(arrLast){
								res.json(arrLast);
							});
						});
					});
				});
			});
		});
		*/
	});
});

//upload image
app.post('/upload', function(req, res) {
		var IDuser = req.body.IDuser;
        fs.readFile(req.files.image.path, function (err, data){
		var newname = Date.now() + '_' +req.files.image.originalFilename;
        var newPath = __dirname + "/upload/avatar/" + newname;
        fs.writeFile(newPath, data, function (err) {
        if(err){
        res.json({'response':"Error"});
        }else {
		updateAvatarUser(newname, IDuser, function(result){
			if (result)
				res.json({'response':"Update avatar done"});
		    else
				res.json({'response':"Error"});
		});
	
}
});
});
});
 //het upload
app.get('/upload/avatar/:file', function (req, res){
        file = req.params.file;
        var img = fs.readFileSync(__dirname + "/upload/avatar/" + file);
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(img, 'binary');
});

//socket io listen a connection event
socketio.on('connection',function(socket)
{
	socket.on('client-gui-IDuser', function(IDuser){
		socket.IDuser = IDuser;
		getUser(IDuser, function(user){
			var email = user.email;
			socket.join(email);
		});
		updateStatusUser(IDuser, 1, function(result){
			getFriendOnline(IDuser, function(rowsFriend){
				for (var i = 0 ; i < rowsFriend.length ; i++)
				{
					var friend_email = rowsFriend[i].email;
					socketio.to(friend_email).emit('server-gui-cap-nhat-friend-online', {friend_email : friend_email});
				}
			});
		});
		joinRoom(IDuser, socket);
	});
	
	socket.on('client-gui-IDFriend-da-ket-ban', function(data){
		catChuoi(data,3, function(mangdacat){
			var IDFriend = mangdacat[0];
			var IDuser = mangdacat[1];
			var nameuser = mangdacat[2];
			getUser(IDFriend, function(user){
				var email = user.email;
				var name = user.name;
				socketio.to(email).emit('server-gui-da-chap-nhan-ket-ban', {IDuser : IDuser, nameFriend : nameuser});
			});
		});
			
	});
	
	socket.on('client-gui-IDFriend-yeu-cau-ket-ban', function(data){
		catChuoi(data,3, function(mangdacat){
			var IDFriend = mangdacat[0];
			var IDuser = mangdacat[1];
			var nameuser = mangdacat[2];
			getUser(IDFriend, function(user){
				var email = user.email;
				var name = user.name;
				socketio.to(email).emit('server-gui-da-nhan-yeu-cau-ket-ban', {IDuser : IDuser, nameFriend : nameuser});
			});
		});
			
	});
	
	socket.on('client-gui-IDRoom', function(IDRoom){
		getUserInRoom(IDRoom, function(rowsUser){
			for (var i = 0; i < rowsUser.length; i++)
			{
				getUser(rowsUser[i]._ID, function(user){
					var email = user.email;
					socketio.to(email).emit('server-gui-loi-moi-vao-room',{email : email});
				});
			}
		});
	});
	
	socket.on('client-gui-message', function(content){
		catChuoi(content,5, function(mangdacat){
			var IDRoom = mangdacat[0];
			var IDuser = mangdacat[1];
			var name = mangdacat[2];
			var avatar = mangdacat[3];
			var message = mangdacat[4];
			updateNoneStatusRoom(IDRoom, function(result){
				insertMessage(IDRoom, IDuser, message, function(result, id){
					getMessage(id, function(msg){
						var time = msg.Time;
						socketio.to(IDRoom+'').emit('server-gui-message',{IDRoom : IDRoom, IDuser : IDuser, message: message, name : name, avatar : avatar, time:time});
						socketio.to(IDRoom+'').emit('server-gui-message-in-room',{IDRoom : IDRoom, IDuser : IDuser, message: message, name : name, avatar : avatar, time:time});
					});
				});
			});

		});
	});
	
	socket.on('client-gui-user-da-seen-room', function(content){
		catChuoi(content,3, function(mangdacat){
			var IDuser = mangdacat[0];
			var IDRoom = mangdacat[1];
			var name = mangdacat[2];
			getLastMessageInRoom(IDRoom, function(msg){
				if (IDuser != msg._IDuser)
				{
					updateUserStatusSeenRoom(IDuser, IDRoom, function(result){
						socketio.to(IDRoom).emit('server-gui-user-seen-room', {IDuser : IDuser, name : name});
					});
				}					
			});
			
		});
	});
	
	socket.on('client-gui-user-da-seen-room-from-load', function(content){
		catChuoi(content,3, function(mangdacat){
			var IDuser = mangdacat[0];
			var IDRoom = mangdacat[1];
			var name = mangdacat[2];
			getLastMessageInRoom(IDRoom, function(msg){
				if (IDuser != msg._IDuser)
				{
					isUserSeenStatusRoom(IDuser, IDRoom, function(output){
						if (!output)
						{
							updateUserStatusSeenRoom(IDuser, IDRoom, function(result){
								socketio.to(IDRoom).emit('server-gui-user-seen-room', {IDuser : IDuser, name : name});
							});
						}
					});
					
				}					
			});
			
		});
	});
	
	socket.on('disconnect', function(){
		updateStatusUser(socket.IDuser, 0, function(result){
			getFriendOnline(socket.IDuser, function(rowsFriend){
				for (var i = 0 ; i < rowsFriend.length ; i++)
				{
					var friend_email = rowsFriend[i].email;
					socketio.to(friend_email).emit('server-gui-cap-nhat-friend-online', {friend_email : friend_email});
				}
			});
		});
	});
});

function catChuoi(chuoi,len, callback){
	var mangdacat = chuoi.split('#',len);
	callback(mangdacat);
}

function themUser(user,callback){
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			callback(false, '', '');
			return;
		}
		con.query('SELECT * FROM user Where email = ?',[user.email], function(err,rows)
		{
			if (err)
			{
				console.log("Loi kiem tra user");
				callback(false, '', '');
				return;
			}
			else
			{
				if (rows.length > 0)
				{
					callback(false, rows[0].email, rows[0].password);
					return;
				}
				else
				{
					con.query('INSERT INTO user SET ?', user, function(err,res)
					{
						con.end();	
						if (err) 
						{
							console.log("Loi truy cap");
							callback(false, '' ,'');
							return;
						}
						else
						{
							callback(true, '', '');
							return;
						}
					});
				}
			}
		});
	});	
}

function isUserAvailable(email,callback){
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			callback(false);
			return;
		}
		con.query('SELECT * FROM user Where email = ?',[email], function(err,rows)
		{
			if (err)
			{
				console.log("Loi kiem tra user");
				callback(false);
				return;
			}
			else
			{
				if (rows.length > 0)
				{
					callback(true);
					return;
				}
				else
				{
					callback(false);
					return;
				}
			}
		});
	});	
}

function dangNhapUser(email, password, callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			callback(false, -1, '');
			return;
		}
		con.query('SELECT * FROM user WHERE email = ? and password = ?',[email,password], function(err, rows){
			con.end();
			if (err)
			{
				callback(false, -1, '');
				return;
			}
			if (rows.length > 0)
			{
				callback(true, rows[0]._ID , rows[0].name, rows[0].avatar);
				return;
			}
			else
			{
				callback(false, -1, '', '');
				return;
			}
		});
	});
}
function timKiemPeople(search,IDuser,start,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT _ID, name, avatar FROM user WHERE (email = ? or name like ?) and _ID <> ? and _ID not in (SELECT u._ID FROM user u, userfriend uf WHERE u._ID = uf._IDFriend and uf._IDuser = ?) LIMIT '+start+',10',[search,'%'+search+'%',IDuser,IDuser], function(err, rowsPeople){
			con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rowsPeople);
		});
	});
}

function timKiemFriend(search,IDuser,start,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT u.* FROM userfriend uf, user u WHERE uf._IDFriend = u._ID and uf._IDuser = ? and (u.name like ? or u.email = ?) LIMIT '+start+',10',[IDuser,'%'+search+'%',search], function(err, rowsFriend){
			con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			var arr = [];
			if (rowsFriend.length > 0)
			{
				async.forEach(rowsFriend, function (item, cb){
					var manguser = [IDuser, item._ID];
					var _ID = item._ID;
					var name = item.name;
					var avatar = item.avatar;
					var status = item.status;
					getIdRoom(manguser, function(room){
						var IDRoom = room._ID;
							var friend = {
							_ID     		: _ID,
							name    		: name,
							avatar  		: avatar,
							status  		: status,
							_IDRoom 		: IDRoom,
							countUserInRoom : 0
							};
							arr.push(friend);
							cb();
					});
				}, function(err) {
					callback(arr);

				});
			}
			else
			{
				callback(arr);
			}
		});
	});
}
function timKiemGroup(search,IDuser,start,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT r.* FROM room r, roomdetail rd WHERE r._ID = rd._IDRoom and rd._IDuser = ? and r.IsGroup = 1 and r.name like ? LIMIT '+start+',10',[IDuser,'%'+search+'%'], function(err, rowsGroup){
			con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rowsGroup);
			/*
			con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			var arrRoom = [];
			var arrFriend = [];
			var arrRequest = [];
			var arrAccept = [];
			var arrNone = [];
			listAllRoom(IDuser, function(output){
				async.each(output, function(itemroom, cbroom){
					if (itemroom.countUserInRoom > 2 && itemroom.nameRoom.includes(search))
					{
						var name = itemroom.nameRoom;
						var avatar = itemroom.avatarRoom;
						var _IDRoom = itemroom.IDRoom;
						var countUserInRoom = itemroom.countUserInRoom;
						var friend = {
							_ID     		: -2,
							name    		: name,
							avatar  		: avatar,
							status  		: 0,
							_IDRoom 		: _IDRoom,
							countUserInRoom : countUserInRoom
							};
							arrRoom.push(friend);
							cbroom();
					}
					else
						cbroom();
				}, function(err){
					async.each(rows, function(item, cb){
					testRelationship(IDuser, item._ID, function(result){
					if (result == 2)
					{
						//friend
						var manguser = [IDuser, item._ID];
						var _ID = item._ID;
						var name = item.name;
						var avatar = item.avatar;
						var status = item.status;
						getIdRoom(manguser, function(_IDRoom){
							var IDRoom = _IDRoom;
							var friend = {
							_ID     		: _ID,
							name    		: name,
							avatar  		: avatar,
							status  		: status,
							_IDRoom 		: IDRoom,
							countUserInRoom : 2
							};
							arrFriend.push(friend);
							cb();
						});
					}
					else
					{
						if (result == 3)
						{
							//request
							var _ID = item._ID;
							var name = item.name;
							var avatar = item.avatar;
							var status = item.status;
							var friend = {
							_ID     		: _ID,
							name    		: name,
							avatar  		: avatar,
							status  		: status,
							_IDRoom 		: -1,
							countUserInRoom : -1
							};
							arrRequest.push(friend);
							cb();
						}
						else
						{
							if (result == 1)
							{
								//accept
								var _ID = item._ID;
								var name = item.name;
								var avatar = item.avatar;
								var status = item.status;
								var friend = {
								_ID     		: _ID,
								name    		: name,
								avatar  		: avatar,
								status  		: status,
								_IDRoom 		: -1,
								countUserInRoom : -1
								};
								arrAccept.push(friend);
								cb();
							}
							else
							{
								if (result == 0)
								{
									//none user
									var _ID = item._ID;
									var name = item.name;
									var avatar = item.avatar;
									var status = item.status;
									var friend = {
									_ID     		: _ID,
									name    		: name,
									avatar  		: avatar,
									status  		: status,
									_IDRoom 		: -1,
									countUserInRoom : -1
									};
									arrNone.push(friend);
									cb();
								}
							}
						}
					}
				});
			}, function(err){
				callback(arrRoom, arrFriend, arrRequest, arrAccept, arrNone);
				});
			});
			});
			*/
		});
	});
}

function requestFriend(request,callback){
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			callback(false);
			return;
		}
		con.query('INSERT INTO requestfriend SET ?', request, function(err,res)
		{
			con.end();	
			if (err) 
			{
				console.log("Loi truy cap");
				callback(false);
				return;
			}
		    else
			{
				callback(true);
			    return;
			}
	    });
	});	
}

function testRelationship(IDuser, IDFriend, callback)
{
	// -1 : error
	// 0 : none
	// 1 : accept
	// 2 : friend
	// 3 : requested friend
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			callback(-1);
			return;
		}
		con.query('SELECT * FROM requestfriend WHERE _IDrequest = ? and _IDuser = ?',[IDFriend, IDuser], function(err, rows){
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				callback(-1);
				return;
			}
			else
			{
				if (rows.length > 0)
				{
					callback(1);
					con.end();
					return;
				}
				else
				{
					con.query('SELECT * FROM requestfriend WHERE _IDrequest = ? and _IDuser = ?',[IDuser, IDFriend], function(err, rows){
					if (err)
					{
						throw err;
						console.log("Loi cau lenh truy van");
						callback(-1);
						return;
					}
					else
					{
						if (rows.length > 0)
						{
							callback(3);
							con.end();
							return;
						}
						else
						{
							con.query('SELECT * FROM userfriend WHERE _IDFriend = ? and _IDuser = ?',[IDFriend, IDuser], function(err, rows){
							con.end();
							if (err)
							{
								throw err;
								console.log("Loi cau lenh truy van");
								callback(-1);
								return;
							}
							else
							{
								if (rows.length > 0)
								{
									callback(2);
									return;
								}
								else
								{
									callback(0);
									return;
								}
							}
							});
						}
					}
				});
			}
			}
		});
	});
}

function insertFriend(IDuser, IDFriend, name, nameFriend,callback){
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			callback(false);
			return;
		}
		var object1 = {
			_IDuser : IDuser,
			_IDFriend : IDFriend
		};
		con.query('INSERT INTO userfriend SET ?',object1, function(err,res)
		{	
			if (err) 
			{
				console.log("Loi truy cap");
				callback(false);
				return;
			}
		    else
			{
				var object2 = {
					_IDuser   : IDFriend,
					_IDFriend : IDuser
				};
				con.query('INSERT INTO userfriend SET ?', object2, function(err,res){
					if (err) 
					{
						console.log("Loi truy cap");
						callback(false);
						return;
					}
					else
					{
						con.query('DELETE FROM requestfriend WHERE _IDuser = ? and _IDrequest', [IDuser, IDFriend], function(err,res){
						if (err) 
						{
							console.log("Loi truy cap");
							callback(false);
							return;
						}
						else
						{
							var room = {
								_ID  : 0,
								name : null,
								IsGroup : 0
							};
							con.query('INSERT INTO room SET ?', room, function(err,res){
								if (err) 
								{
									console.log("Loi truy cap");
									callback(false);
									return;
								}
								else
								{
									var id = res.insertId;
									var manguser = [IDuser , IDFriend];
									async.each(manguser, function(item, cb){
										var roomdetail = {
											_IDRoom : id,
											_IDuser : item
										};
										con.query('INSERT INTO roomdetail SET ?', roomdetail, function(err,res){
										if (err) 
										{
											console.log("Loi truy cap");
											callback(false);
											return;
										}
										cb();
										});
									},function(err){
										callback(true);
										con.end();
										return;
									});
								}
							});
						}
						});
					}
					//
				});
			}
	    });
	});	
}

function listRequestFriend(IDuser,start,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT us._ID,us.name, us.avatar FROM requestfriend rf, user us WHERE rf._IDuser = ? and rf._IDrequest = us._ID LIMIT '+ start+',10',[IDuser], function(err, rows){
			con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows);
		});
	});
}

function requestFriend(request,callback){
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			callback(false);
			return;
		}
		con.query('INSERT INTO requestfriend SET ?', request, function(err,res)
		{
			con.end();	
			if (err) 
			{
				console.log("Loi truy cap");
				callback(false);
				return;
			}
		    else
			{
				callback(true);
			    return;
			}
	    });
	});	
}

function joinRoom(IDuser, socket)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT * From roomdetail WHERE _IDuser = ?',[IDuser], function(err, rows){
			con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			else
			{

				if (rows.length > 0)
				{
					for (var i=0 ; i<rows.length ; i++)
					{
						socket.join(''+rows[i]._IDRoom);
					}
				}
				else
				{
					//khong co room
				}
			}
		});
	});
}

function getIdRoom(manguser,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		tachMangUserThanhChuoi(manguser, function(chuoi){
			con.query('SELECT * FROM room WHERE IsGroup = 0 and _ID in (SELECT _IDRoom FROM roomdetail WHERE _IDuser IN '+chuoi+' GROUP BY _IDRoom HAVING Count(DISTINCT _IDuser) = ?)',[manguser.length], function(err, rows){
			con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows[0]);
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

function listFriendOnline(IDuser,start,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT us._ID,us.name, us.avatar, us.status FROM userfriend uf, user us WHERE uf._IDuser = ? and uf._IDFriend = us._ID and us.status = 1 LIMIT '+ start+',10',[IDuser], function(err, rows){
			con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			var arr = [];
			if (rows.length > 0)
			{
				async.forEach(rows, function (item, cb){
					var manguser = [IDuser, item._ID];
					var _ID = item._ID;
					var name = item.name;
					var avatar = item.avatar;
					var status = item.status;
					getIdRoom(manguser, function(room){
						var IDRoom = room._ID;
						var IsGroup = 0;
							var friend = {
							_ID     		: _ID,
							name    		: name,
							avatar  		: avatar,
							status  		: status,
							_IDRoom 		: IDRoom,
							countUserInRoom : IsGroup
							};
							arr.push(friend);
							cb();
					
					});
				}, function(err) {
					callback(arr);

				});
			}
			else
			{
			callback(arr);
			}
		});
	});
}

function listFriend(IDuser,start,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT us._ID,us.name, us.avatar, us.status FROM userfriend uf, user us WHERE uf._IDuser = ? and uf._IDFriend = us._ID LIMIT '+ start+',10',[IDuser], function(err, rows){
			con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			var arr = [];
			if (rows.length > 0)
			{
				async.forEach(rows, function (item, cb){
					var manguser = [IDuser, item._ID];
					var _ID = item._ID;
					var name = item.name;
					var avatar = item.avatar;
					var status = item.status;
					getIdRoom(manguser, function(room){
						var IDRoom = room._ID;
						var IsGroup = 0;
							var friend = {
							_ID     		: _ID,
							name    		: name,
							avatar  		: avatar,
							status  		: status,
							_IDRoom 		: IDRoom,
							countUserInRoom : IsGroup
							};
							arr.push(friend);
							cb();
					});
				}, function(err) {
					callback(arr);
				});
			}
			else
			{
			callback(arr);

			}
		});
	});
}

function getUser(IDuser,callback)
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
		con.query('SELECT * FROM user WHERE _ID = ?',[IDuser], function(err, rows){
    		con.end();
    		if (err) throw err;
			callback(rows[0]);
  		});
	});
}

function getNameUser(IDuser,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT name FROM user WHERE _ID = ?',[IDuser], function(err, rows){
			con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows[0].name);

		});
	});
}

function updateNameUser(name, IDuser,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('UPDATE user set name = ? WHERE _ID = ?',[ name , IDuser], function(err, rows){
			con.end();
			if (err)
			{
				console.log("Lenh update bi loi");
				callback(false);

				return;
			}
			else
			{
				callback(true);
				return;
			}
		});
	})
}

function updateGenderUser(gender, IDuser,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('UPDATE user set gender = ? WHERE _ID = ?',[ gender , IDuser], function(err, rows){
							con.end();
			if (err)
			{
				console.log("Lenh update bi loi");
				callback(false);

				return;
			}
			else
			{
				callback(true);
				return;
			}
		});
	})
}


function updatePasswordUser(oldpassword, newpassword, IDuser,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('select * from user where _ID = ? and password = ?',[ IDuser, oldpassword ], function(err, rows){
			if (rows.length > 0)
			{
				con.query('UPDATE user set password = ? WHERE _ID = ?',[ newpassword , IDuser ], function(err, rows){
					con.end();
					if (err)
					{
						console.log("Lenh update bi loi");
						callback(false);
						return;
					}
					else
					{
						callback(true);
						return;
					}
					});
			}
			else
			{
				con.end();
				callback(false);
				return;
			}

		});
		
	})
}

function updateBirthdayUser(birthday, IDuser,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('UPDATE user set date_of_birth = ? WHERE _ID = ?',[ birthday , IDuser], function(err, rows){
			con.end();
			if (err)
			{
				console.log("Lenh update bi loi");
				callback(false);
				return;
			}
			else
			{
				callback(true);
				return;
			}
		});
	})
}

function updateAvatarUser(avatar, IDuser,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('UPDATE user set avatar = ? WHERE _ID = ?',[ avatar , IDuser], function(err, rows){
							con.end();
			if (err)
			{
				console.log("Lenh update bi loi");
				callback(false);

				return;
			}
			else
			{
				callback(true);

				return;
			}
		});
	})
}

function inviteList(IDRoom, IDuser,start,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT _ID, name, avatar FROM user WHERE _ID IN (SELECT _IDFriend FROM userfriend WHERE _IDuser = ? AND _IDFriend Not IN (SELECT _IDuser FROM roomdetail WHERE _IDRoom = ?)) LIMIT '+ start+',10',[IDuser,IDRoom], function(err, rows){
						con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows);

			return;
		});
	});
}

function inviteListToCreateNewRoom(IDRoom, IDuser,start,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT _ID, name, avatar FROM user WHERE _ID IN (SELECT _IDFriend FROM userfriend WHERE _IDuser = ?) LIMIT '+ start+',10',[IDuser,IDRoom], function(err, rows){
						con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows);

			return;
		});
	});
}

function countUserInRoom(IDRoom, callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT COUNT(*) as count FROM roomdetail WHERE _IDRoom = ?',[IDRoom], function(err, rows){
						con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows[0].count);

			return;
		});
	});
}

function themUserVaoRoom(manguser, IDRoom, callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		async.each(manguser, function(item,cb){
			var roomdetail = {
				_IDRoom : IDRoom,
			    _IDuser : item
			};
			con.query('INSERT INTO roomdetail SET ?', roomdetail, function(err,res){
							
			if (err) 
			{
				console.log("Loi truy cap");
				callback(false);
				return;
			}
			cb();
			});
		}, function(err){
			callback(true);
			con.end();
			return;
		});
	});	
}

function getUserInRoom(IDRoom, callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT user._ID, user.name, user.avatar FROM roomdetail, user WHERE roomdetail._IDRoom = ? and roomdetail._IDuser = user._ID',[IDRoom], function(err, rows){
						con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows);
			return;
		});
	});
}

function getUserInRoomLoaiBoIDuser(IDRoom,IDuser,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT user._ID, user.name, user.avatar FROM roomdetail, user WHERE roomdetail._IDRoom = ? and roomdetail._IDuser <> ? and roomdetail._IDuser = user._ID',[IDRoom, IDuser], function(err, rows){
						con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows);
			return;
		});
	});
}

function getRoom(IDRoom,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT * from room where _ID = ?',[IDRoom], function(err, rows){
			con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows);
			return;
		});
	});
}

function taoRoom(manguser, nameGroup, IDuser, callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		var room = {
				_ID  : 0,
			    name : nameGroup,
				IsGroup : 1
	    };
		con.query('INSERT INTO room SET ?', room, function(err,res){
		if (err) 
		{
				console.log("Loi truy cap");
				callback(false, -1);
				return;
		}
		else
	    {
			var id = res.insertId;
			var message = nameGroup + ' created. Chat together right now'; 
			insertMessage(id, IDuser, message , function(result){
				if (result)
				{
					async.each(manguser, function(item, cb){
					var roomdetail = {
						_IDRoom : id,
						_IDuser : item
					};
					con.query('INSERT INTO roomdetail SET ?', roomdetail, function(err,res){
					if (err) 
					{
						console.log("Loi truy cap insert vao roomdetail");
						callback(false, -1);
						return;
					}
					cb();
					});
					}, function(err){
						con.end();
						callback(true, id);
						return;
					});
				}
				else
				{
					con.end();
					callback(false, -1);
					return;
				}
			});
		}
		});
	});
}

function pushUserInArray(manguser,rowsID,callback)
{
	var arr = manguser;
	async.each(rowsID, function(item, cb){
		arr.push(item._ID);
		cb();
	}, 
	function(err){
		callback(arr);
		return;
	});
}

function addFriendToRoom(manguser, IDRoom,nameGroup, IDuser, callback)
{
	countUserInRoom(IDRoom, function(count){
		if (count == 2)
		{
			//tao room moi
			getUserInRoom(IDRoom, function(rows){
				pushUserInArray(manguser, rows, function(arrayUser){
					taoRoom(arrayUser, nameGroup,IDuser, function(result, insertID){
					callback(result, 1, insertID);
				});
				});
			});
		}
		else
		{
			//them user vao room hien co
			themUserVaoRoom(manguser , IDRoom, function(result){
				callback(result, 2, IDRoom);
			});
		}
	});
}

function parseJSON(json, callback)
{
	callback(JSON.parse(json));
}

function pushObjectToArray(arr, object, callback){
	var array = arr;
	callback(array.push(object));
}

function listAllRoomPage(array, start, callback)
{
	callback(array.slice(parseInt(start),parseInt(start)+10));
}

function listAllRoom(IDuser,start,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT message.*,room.name,room.IsGroup From message INNER JOIN (SELECT _IDRoom, MAX(_ID) as LastTime FROM message WHERE _IDRoom in (SELECT _IDRoom From roomdetail WHERE _IDuser = ?) GROUP BY _IDRoom) roomlasttime ON message._IDRoom = roomlasttime._IDRoom JOIN room ON message._IDRoom = room._ID WHERE message._ID = roomlasttime.LastTime ORDER BY message._ID desc LIMIT '+start+',10',[IDuser], function(err, rowsRoom){
			con.end();
			var listRoom = [];
			async.each(rowsRoom, function(item, cb){
				var _ID = item._ID;
				var _IDRoom = item._IDRoom;
				var _lastMessage = item.Message;
				var _lastTime = item.Time;
				var IsGroup = item.IsGroup;
				var _nameRoom = item.name;
				if (IsGroup == 0)
					{
						//room 2 nguoi
						getUserInRoomLoaiBoIDuser(_IDRoom, IDuser, function(userInRoom){
							var IDRoom = _IDRoom;
							var nameRoom = userInRoom[0].name;
							var avatarRoom = userInRoom[0].avatar;
							var lastMessage = _lastMessage;
							var lastTime = _lastTime;
							var countUserInRoom = 0;
							var room = {
								_ID              : _ID,
								IDRoom      	: IDRoom,
								nameRoom    	: nameRoom,
								avatarRoom  	: avatarRoom,
								lastMessage 	: lastMessage,
								countUserInRoom : countUserInRoom,
								lastTime        : lastTime
							};
							listRoom.push(room);
							cb();
						});
					}
					else
					{
						//room group 3 nguoi tro len
							var IDRoom = _IDRoom;
							var nameRoom = _nameRoom;
							var avatarRoom = null;
							var lastMessage = _lastMessage;
							var lastTime = _lastTime;
							var countUserInRoom = 1;
							var room = {
								_ID              : _ID,
								IDRoom      	: IDRoom,
								nameRoom    	: nameRoom,
								avatarRoom  	: avatarRoom,
								lastMessage 	: lastMessage,
								countUserInRoom : countUserInRoom,
								lastTime        : lastTime
							};
							listRoom.push(room);
							cb();
					}
			}, function(err){
				callback(listRoom);
				return;
			});
		});
	});
}

function insertMessage(IDRoom ,IDuser, message, callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		var messageObject = {
				_IDRoom  : IDRoom,
			    _IDuser : IDuser,
				Message : message
	    };
		con.query('INSERT INTO message SET ?', messageObject, function(err,res){
						con.end();
		if (err) 
		{
			console.log("Loi truy cap");
			callback(false, -1);
			return;
		}
		else
	    {
			callback(true, res.insertId);

			return;
		}
		});
	});
}

function listMessageInRoom(IDRoom,start,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT message.*, user.name, user.avatar FROM message, user where message._IDRoom = ? and user._ID = message._IDuser ORDER BY TIME DESC LIMIT '+ start+',10',[IDRoom], function(err, rows){
						con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows);
			return;
		});
	});
}

function getLastMessageInRoom(IDRoom,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT * from message where _IDRoom = ? ORDER BY TIME DESC LIMIT 0,1',[IDRoom], function(err, rows){
						con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows[0]);

			return;
		});
	});
}

function getMessage(ID, callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT * from message where _ID = ?',[ID], function(err, rows){
						con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows[0]);

			return;
		});
	});
}

function compareID(a,b) {
  if (a._ID < b._ID)
    return -1;
  if (a._ID > b._ID)
    return 1;
  return 0;
}

function compareRoom(a,b) {
  if (a._ID > b._ID)
    return -1;
  if (a._ID < b._ID)
    return 1;
  return 0;
}

function compareIDRoom(a,b) {
  if (a.IDRoom < b.IDRoom)
    return -1;
  if (a.IDRoom > b.IDRoom)
    return 1;
  return 0;
}

function compareIDRoomTwo(a,b) {
  if (a._IDRoom < b._IDRoom)
    return -1;
  if (a._IDRoom > b._IDRoom)
    return 1;
  return 0;
}

function compareLastMessageTime(a,b) {
  if (a.lastMessageTime < b.lastMessageTime)
    return 1;
  if (a.lastMessageTime > b.lastMessageTime)
    return -1;
  return 0;
}

function compareSearchOrder(a,b) {
  if (a.order < b.order)
    return -1;
  if (a.order > b.order)
    return 1;
  return 0;
}

function compareSearchIdKey(a,b) {
  if (a.IdKey < b.IdKey)
    return -1;
  if (a.IdKey > b.IdKey)
    return 1;
  return 0;
}

function sortListFriend(arr, callback)
{
	callback(arr.sort(compareID));
}

function sortListAllRoom(arr, callback)
{
	callback(arr.sort(compareRoom));
}

function sortListAllRoomTwo(arr, callback)
{
	callback(arr.sort(compareIDRoomTwo));
}

function sortListRoomMessageTime(arr, callback)
{
	callback(arr.sort(compareLastMessageTime));
}

function sortIdListSearch(arr, callback)
{
	callback(arr.sort(compareSearchIdKey));
}

function sortListSearch(arr, callback)
{
	callback(arr.sort(compareSearchOrder));
}

function updateStatusUser(IDuser,status,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('UPDATE user set status = ? WHERE _ID = ?',[ status , IDuser], function(err, rows){
							con.end();
			if (err)
			{
				console.log("Lenh update bi loi");
				callback(false);

				return;
			}
			else
			{
				callback(true);

				return;
			}
		});
	});
}

function isRoomHaveMessage(IDRoom,callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('SELECT * FROM message WHERE _IDRoom = ?',[IDRoom], function(err, rows){
								con.end();
			if (err)
			{
				console.log("Lenh update bi loi");
				callback(false);

				return;
			}
			else
			{
				if (rows.length > 0)
				{
					callback(true);

					return;
				}
				else
				{
					callback(false);

					return;
				}
			}
		});
	})
}

function parseDateToMili(date, callback){
	callback(date.getTime());
}

function setIdKeyArray(arr, callback)
{
	var i = 0;
	var arrnew = arr;
	async.each(arrnew, function(item, cb){
		item.IdKey = i;
		i++;
		cb();
	}, function(err){
		callback(arrnew);
	});
}

function getFriendOnline(IDuser, callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('select user.email from userfriend, user where userfriend._IDuser = ? and userfriend._IDFriend = user._ID and user.status = 1',[IDuser], function(err, rows){
						con.end();
			if (err)
			{
				throw err;
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows);

			return;
		});
	});
}

function updateNoneStatusRoom(IDRoom, callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('Update roomdetail set status_seen = 0 where _IDRoom = ?',[IDRoom], function(err, res){
			con.end();
			if (err)
			{
				callback(false);
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(true);
			return;
		});
	});
}

function updateUserStatusSeenRoom(IDuser,IDRoom, callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('Update roomdetail set status_seen = 1 where _IDRoom = ? and _IDuser = ?',[IDRoom,IDuser], function(err, res){
			con.end();
			if (err)
			{
				callback(false);
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(true);
			return;
		});
	});
}

function getAllUserSeenRoom(IDuser, IDRoom, callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('select user._ID, user.name from roomdetail,user where roomdetail.status_seen = 1 and roomdetail._IDRoom = ? and roomdetail._IDuser <> ? and roomdetail._IDuser = user._ID',[IDRoom,IDuser], function(err, rows){
			con.end();
			if (err)
			{
				callback(rows);
				console.log("Loi cau lenh truy van");
				return;
			}
			callback(rows);
			return;
		});
	});
}

function isUserSeenStatusRoom(IDuser,IDRoom, callback)
{
	var con = mysql.createConnection({
	host: db_host,
	user: db_username,
	password: db_password,
	database: db_name
	});
	con.connect(function(err)
	{
		if(err)
		{
			console.log('Error connecting to Db');
			return;
		}
		con.query('select * from roomdetail where status_seen = 1 and _IDRoom = ? and _IDuser = ?',[IDRoom,IDuser], function(err, rows){
			con.end();
			if (rows.length > 0)
			{
				callback(true);
				return;
			}
			else
			{
				callback(false);
				return;
			}
		});
	});
}