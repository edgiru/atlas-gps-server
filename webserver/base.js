var md5 = require('./md5');
var db = require('./mysql');


exports.decode = function (req, res, fs) {
	var body = '';
	req.on('readable',function () {
		body += req.read();
	}).on('end', function () {
			if (body) {
				try {
					body = JSON.parse(body);
				} catch (err) {
					res.statusCode = 404;
					res.end('err1');
				}
				var login = body.login;
				var pass = body.pass;
				if (login && pass) {
					var key = (Math.random() * 1000000).toFixed(0);
					key = md5.md5(key);
					var cookies = req.headers.cookie;
					var response = 'user=' + body.login + '&key=' + key;
					db.checkPass(login, pass, key, function (tr) {
						if (tr) {
							res.setHeader("Set-Cookie", ["user=" + body.login, "key=" + key]);
							res.end('ok');
						} else {
							res.statusCode = 404;
							res.end('/authErr.html');//не совпадение в базе
							// res.end('err2');
						}
					});
				} else {
					res.render('views/authError', {
						init: "formLogin.init()"
					}, function (err, html) {
						res.send(html)
					})
				}
			} else {
				res.statusCode = 404;
				res.end('err4');
			}
		});
};

exports.login = function (req, res, fs, ejs) {
	var cookies = req.headers.cookie;
	var obj = {};
	if (cookies) {
		console.log('cookies:  ' + cookies);
		cookies = cookies.replace(/\s/g, '');
		//  console.log('cookies' + cookies);
		var arr = cookies.split(';');
		for (var i = 0; i < arr.length; i++) {
			obj[arr[i].split('=')[0]] = arr[i].split('=')[1];
		}
		var login = obj.user;
		var pass = obj.pass;
		var key = obj.key;
		db.checkCoocies(login, pass, key, function (tr) {
			if (tr) {
				db.getDevice(login, function (dev, options) {
					var devices = null;
					var optstring = null;
					if (dev || dev == '') {
						if (dev) {
							dev = dev.replace(/(\n(\r)?)/g, '');
							dev = dev.replace(/\r\n/g, "\n");
							devices = '' + dev;
							try {
								dev = JSON.parse(dev)
							} catch (err) {
								dev = null
							}
						} else {
							dev = null;
						}
						if (options) {
							options = options.replace(/\r\n/g, "\n");
							optstring = options;
							try {
								options = JSON.parse(options)
							} catch (err) {
								options = null
							}
						} else {
							options = null;
						}
						console.log('devices:    ' + devices);
						// удачный вход
						db.getLastData(dev, function (lastData) {
							var lastData = JSON.stringify(lastData);
							res.render('views/login', {
								names: dev,
								map: options ? options.map : null,
								devices: devices,
								options: optstring,
								lastData: lastData
							}, function (err, html) {
								if (!err) {
									res.send(html);
								}else{
                                    console.log('err base 107 devices:' + devices);
                                    res.send('err base 107')
                                  //  res = null;
                                    key = null;
                                    pass = null;
                                    login = null;
                                    arr = null;
                                    obj = null;
                                    cookies = null;
                                    dev = null;
                                    options = null;
                                }


							});
						})


					} else {
						res.end('Error Data Base1');
						key = null;
						pass = null;
						login = null;
						arr = null;
						obj = null;
						cookies = null;
					}

				})

				/*
				 var file = new fs.createReadStream('../public/views/login.html');
				 sendFile(file, res);
				 */
			} else {


				res.render('views/authError', {
					init: "formLogin.init()"
				}, function (err, html) {
					res.send(html)
				})

			}
		})
	} else {
		console.log('Error Authorization');
		res.render('views/noauth', {
			init: "formLogin.init()"
		});
		//  res.end('Error Authorization');
	}

}

exports.auth = function (req, res) {
	//генерируем форму auth.ejs на главную страницу вместо init помещаем фунцию

	res.render('views/auth', {
		init: "formLogin.init()"
	});
}

exports.authErr = function (req, res) {
	res.render('views/authError', {
		init: ""
	});
}

exports.gedDevices = function (req, res, success) {
	if (req.headers.cookie) {
		var cookies = req.headers.cookie.replace(/\s/g, '');
		var arr = cookies.split(';');
		var obj = {};
		for (var i = 0; i < arr.length; i++) {
			obj[arr[i].split('=')[0]] = arr[i].split('=')[1];
		}
		var login = obj.user;
		var pass = obj.pass;
		var key = obj.key;
		db.checkCoocies(login, pass, key, function (tr) {
			if (tr) {
				db.getDevice(login, function (dev, options) {
					var devices = null;
					var optstring = null;
					if (dev || dev == '') {
						if (dev) {
							dev = dev.replace(/(\n(\r)?)/g, '');
							dev = dev.replace(/\r\n/g, "\n");
							devices = '' + dev;
							try {
								dev = JSON.parse(dev)
							} catch (err) {
								dev = null
							}
						} else {
							dev = null;
						}
						success(dev);
						obj = null;
						cookies = null;
					}
				})
			} else {
				console.log('err 184');
				success(null);
			}
		})

	} else {
		console.log('err 193');
		success(null);
	}

}

function decodeCocies(cookies) {
	console.log('cookies:  ' + cookies);
	cookies = cookies.replace(/\s/g, '');
	//  console.log('cookies' + cookies);
	var arr = cookies.split(';');
	for (var i = 0; i < arr.length; i++) {
		obj[arr[i].split('=')[0]] = arr[i].split('=')[1];
	}
	return {login: obj.user, pass: obj.pass, key: obj.key}
}

function sendFile(file, res) {
	file.pipe(res);
	file.on('error', function (err) {
		res.statusCode = 500;
		res.end('Server error');
	});
	res.on('close', function () {
		file.destroy();
	})
}

var Url = {
	// публичная функция для кодирования URL
	encode: function (string) {
		return escape(this._utf8_encode(string));
	},

	// публичная функция для декодирования URL
	decode: function (string) {
		return this._utf8_decode(unescape(string));
	},

	// приватная функция для кодирования URL
	_utf8_encode: function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// приватная функция для декодирования URL
	_utf8_decode: function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

}