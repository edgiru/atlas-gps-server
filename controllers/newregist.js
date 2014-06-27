var config = require('../webserver/web-config.json');

var db = require('../webserver/mysql');
var mysql = require('../node_modules/mysql');


exports.init = function(req, res){
    var body = '';
    req.on('readable',function () {
        body += req.read();
    }).on('end', function (){
            if (body) {
                try {
                    body = JSON.parse(body);
                } catch (err) {
                    console.log('err 18 new regist');
                    res.statusCode = 500;
                    res.end('/authErr.html');
                    return null;
                }
                var login = body.login;
                var pass = body.pass;
                var confirm_pass = body.confirm_pass;

                if(login && pass && confirm_pass){ //если поля не пустые
                    if(pass ==confirm_pass){
                        console.log((login+' : '+pass+' : '+confirm_pass).green);
                        registration(login, pass, res);
                    }else{
                        console.log((login+' : '+pass+' : '+confirm_pass).red); //пароли не совпадают
                        res.statusCode = 500;
                        res.end('/distinctionPass')
                    }
                }else{
                    res.statusCode = 500;
                    res.end('/distinctionPass')

                }
            }

        })

}

function registration(login, pass, res){
    var connection = mysql.createConnection(config.mysql);

    connection.query("SELECT name FROM user WHERE name =? ORDER BY name", [login], function(err, result, fields){
        if (err){
            throw  err;
            res.statusCode = 500;
            res.end('/')
        }else{
            if(result.length){ //пользователь с таким именем существует
                console.log(result);
                res.statusCode = 500;
                res.end('/authErr.html');
            }else{
                connection.query("INSERT INTO user SET ?", {name:login, pass: pass}, function(err, reult){
                    res.end('/successRegist');
                })
            }
        }
    })

}