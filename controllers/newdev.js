var config = require('../webserver/web-config');

var db = require('../webserver/mysql');
var mysql = require('../node_modules/mysql');

exports.init = function (req, res, success) {

    var cookies = req.headers.cookie;
    var obj = {};
    if (cookies) {
        console.log('cookies' + cookies);
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
                getBodyParams(req, res, login);
            } else {
                res.statusCode = 404;
                res.end('err Data base for save option');
            }
        })
    } else {
        res.statusCode = 404;
        res.end('err cookies for save option');
    }
};

function getBodyParams(req, res, login) {
    var body = '';
    var error = null;
    req.on('readable',function () {
        body += req.read();
    }).on('end', function () {
            if (body) {
                try {
                    body = JSON.parse(body);
                } catch (err) {
                    console.log("err add devise. json can't");
                    res.statusCode = 404;
                    res.end('err add devise. json can\'t');
                    error = err;
                }
                if (!error) {
                    saveOptions(res, login, body); // если нет ошибок направляем на сохранения опций
                }
            } else {
                console.log("err save map option. body null can't");
                res.statusCode = 404;
                res.end('err save map option');
            }
        })
}

function saveOptions(res, login, data) {
    console.log(data.dev);
    var connection = mysql.createConnection(config.mysql);
    // res.statusCode =404;
    connection.query('SELECT * FROM user WHERE name = ?', [login], function (error, result, fields) {
        if (error) {
            console.log('Data Base Error1: new dev');
            // connection.end();
            res.statusCode = 500;
            res.end('Error data base');
            return false;
        } else {
            var getOptions = result[0]['device'];
            var setOptions = data; // опции которые нужно сохранить
            if (getOptions) {
                try {
                    getOptions = JSON.parse(getOptions); //текущие опции из базы
                } catch (err) {
                    console.log('cannot parse db opt')
                }
                getOptions.push({'name':data.dev, 'imei':data.imei});
                setOptions = JSON.stringify(getOptions);
                console.log('setOptions: ' + setOptions);
                connection.query('UPDATE `nodemonitor`.`user` SET `device` = ? WHERE `user`.`name` = ?', [setOptions, login], function (err, result) {
                    console.log('setOptions: ' + setOptions);
                    res.end('Устройство добавлено. Страница будет обновлена');
                });
            } else {
                setOptions = [
                    {'name':data.dev, 'imei':data.imei}
                ];
                setOptions = JSON.stringify(setOptions);
                connection.query('UPDATE `nodemonitor`.`user` SET `device` = ? WHERE `user`.`name` = ?', [setOptions, login], function (err, result) {
                    console.log('setOptions: ' + setOptions);
                    res.end('ok');
                });
            }
        }
    })
}