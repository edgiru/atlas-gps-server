var db = require('./mysql');

exports.set = function(req, res, success){

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
        db.checkCoocies(login, pass, key, function (tr){
            if(tr){
                getBodyParams(req, res, login);
            } else{
                res.statusCode = 404;
                res.end('err Data base for save option');
            }
        })

    }else{
        res.statusCode = 404;
        res.end('err cookies for save option');
    }

};
// запускается в случае удачной проверки ключа сессии
function getBodyParams(req, res, login){
    var body = '';
    var error = null;
    req.on('readable',function () {
        body += req.read();
    }).on('end', function () {
            if (body) {
                try {
                    body = JSON.parse(body);
                } catch (err) {
                    console.log("err save map option. json can't");
                    res.statusCode = 404;
                    res.end('err save map option');
                    error = err;
                }
                if(!error){
                    saveOptions(req, res, login, body); // если нет ошибок направляем на сохранения опций
                }
            }else{
                console.log("err save map option. body null can't");
                res.statusCode = 404;
                res.end('err save map option');
            }
        })
}
function saveOptions(req, res, login, data){
    var map = data.map;
    console.log('Get map: '+map);
    db.saveOptions(login, data, function(tr){
        if(tr){
            res.statusCode = 200;
            res.send('ok');
        }else{
            console.log("err save option 1");
            res.statusCode = 404;
            res.end('err save map option');
        }

    })



}