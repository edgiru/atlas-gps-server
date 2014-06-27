var config = require('../webserver/web-config.json');

var db = require('../webserver/mysql');
var mysql = require('../node_modules/mysql');

exports.init = function (req, res) {
    var cookies = req.headers.cookie;
    var obj = {};
    if (cookies) {
        //console.log('cookies' + cookies);
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
                res.end('err show track err Data base ');
            }
        })
    } else {
        res.statusCode = 404;
        res.end('err show track, err cookies for ');
    }
}
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
                    console.log("err show track. json can't");
                    res.statusCode = 404;
                    res.end('err show track. json can\'t');
                    error = err;
                }
                if (!error) {
                    getTrack(res, login, body); // если нет ошибок направляем на сохранения опций
                }
            } else {
                console.log("err show track. body null can't");
                res.statusCode = 404;
                res.end('err show track');
            }
        })
}
function getTrack(res, login, body) {
    var connection = mysql.createConnection(config.mysql);
   var from = ""+body.from;
    connection.query("SELECT * FROM log WHERE imei = ? AND  datetime>= ? AND datetime<= ? ORDER BY datetime", [body.imei, body.from, body.to], function (error, result, fields) {
        if(error){
            console.log((error))
        }else{
            console.log(result)
            if(result && result.length){
                try{
                    result = JSON.stringify(result);
                    res.end(result);
                }catch (err){
                    console.log('err 70: '+err)
                    res.end('null')
                }

            }else{
                res.end('null')
            }

        }
    })

   // console.log((body.from).red)
  //  res.end(body.from)
}