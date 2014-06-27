var config = require('./web-config.json');

var express = require('express');
var http = require('http');
var httpn = require('http');
var fs = require("fs");
var path = require('path');



var logger = require("./logger");
var base = require("./base");
var setoptions = require("./setoptions");

var controllers = require("../controllers");
var net = require('net');
var colors = require('colors');
var port = config.port;
var app = express();



httpn.createServer(function(req, res) {

    sendFileSafe('/views/technical.html', res)

   // response.writeHead(200, {"Content-Type": "text/plain"});
   // response.write("Hello World");
   // response.end();
}).listen(8080);



require('look').start(3131);


app.engine('ejs', require("ejs-locals"));
app.set('views', config.public);
app.set('view engine', 'ejs');

app.set('port', port);


var server = http.createServer(app).listen(port, function () {
    console.log("Server listening on: " + port);
});

var io = require('socket.io').listen(server, { log:false });
logger.init(io);
io.sockets.on('connection', function (socket) {

    // socket.emit('news', socket.id);
    // GPSMarker.connection(socket, io);//регистрация нового соединения
    // socket.emit('news', { hello: 'world' });
    socket.on('connect', function (data) { //получаем данные от подсоединенного клиента
        logger.pushConnect(socket, data);
    });
    socket.on('disconnect', function () {
        logger.clearData(socket.id);
    })
});
//



Object.defineProperty(global, '__stack', {
    get: function(){
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack){ return stack; };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});
Object.defineProperty(global, '__line', {
    get: function(){
        return __stack[1].getLineNumber();
    }
});


function echo(m){
    console.log('line: ' + __stack[1].getLineNumber()+" > "+ m);
}

//console.log(__line);

app.post('/setoption', function (req, res) {
    setoptions.set(req, res);
});
app.post('/newdev', function (req, res) {
    controllers.switch('newdev', req, res);
});
app.post('/deldev', function (req, res) {
    controllers.switch('deldev', req, res);
});
app.post('/show_track', function (req, res) {
    controllers.switch('show_track', req, res);
});

app.get('/newuser', function(req, res){
    res.render('views/newuser', {
        init: "formLogin.init()"
    });
})
app.post('/newregist', function(req, res){
    controllers.switch('newregist', req, res);
})

app.get('/views/devices.html', function (req, res) {
    base.gedDevices(req, res, function (dev) {
        if (dev) {
            res.render('views/devices', {
                names:dev
            }, function (err, html) {
                if (err) console.log(('err 58 ' + err).red);
                res.send(html)
            })
        } else {
            res.render('views/devices', {
                names:null
            }, function (err, html) {
                if (err) console.log(('err 84 ' + err).red);
                res.send(html)
            })
        }
    })
});

app.get('/views/report.html', function (req, res) {
    res.render('views/report', {

    }, function (err, html) {
        if (err) console.log(('err 73 ' + err).red);
        res.send(html)
    })
});

app.get('/successRegist', function (req, res){
    res.render('views/successRegist', {
        init: ""
    });
})
app.get('/existenceUser', function (req, res){
    res.render('views/existenceUser', {
        init: ""
    });
})
app.get('/distinctionPass', function (req, res){
    res.render('views/distinctionPass', {
        init: ""
    });
})


app.use(function (req, res, next) {
    console.log(("new connection req.url: " + req.url).blue);
    var file;
    var path = '../public' + req.url;
    path = path.split('?')[0];
    switch (req.url) {
        case '/favicon.ico':
            sendFileSafe('/img/favicon.ico', res);
            break;
        case'/':
            base.auth(req, res)
            break;
        case'/regist.html':
            base.decode(req, res, fs);
            break;
        case'/authErr.html':
            base.authErr(req, res, fs);
            break;
        case'/login.html':
            base.login(req, res, fs, require('ejs'));
            break;
        default:
            sendFileSafe(req.url, res)
            break;
    }
})
__dirname = __dirname.replace("\\webserver",'')
__dirname = __dirname.replace("\webserver",'');
var ROOT = __dirname+'//public';
function sendFileSafe(filePath, res){
    try{
        filePath = decodeURIComponent(filePath);
    }catch (err){
        res.statusCode = 400;
        console.log('Bad request1'.red);
        res.end('Bad request1');
        return
    }
    if(~filePath.indexOf('\0')){
        res.statusCode = 400;
        console.log('Bad request2'.red);
        res.end('Bad request2');
        return
    }

    filePath = path.normalize(path.join(ROOT, filePath));



    fs.stat(filePath, function(err, stats){
        if(err ){
            res.statusCode = 404;
            console.log(('File not found2'+filePath).red);
            res.end('File not found2');
            return;
        }
        if(!stats.isFile()){
            res.statusCode = 404;
            console.log('File not found3'.red);
            res.end('File not found3');
            return;
        }
        sendFile(filePath, res);
    })
}

function sendFile(filePath, res){
    fs.readFile(filePath, function(err, content){
        if(err){
            console.log("Error read file"+filePath)
        }else{
           var mime = require('mime').lookup(filePath);
           res.setHeader('Content-Type', mime+'; charset = utf-8' );
           res.end(content)
        }
    })
}

logger.GPSMarker(net);
logger.GpsLogger(net);
logger.GpsGate(net);