var mysql=require('./mysql');
var gpsmarker=require('./gpsmarker');
var gpslogger=require('./gpslogger');
var c=0;
var connection={};
var io=null;
var diviseOnline={};
var tesSocketId=null;

exports.init=function(_io){
	io=_io;
}

exports.sendClient=function(data){ //данные от трекера

	tesSocketId=getId(data);
	console.log('tesSocketId: '+tesSocketId);
	if(tesSocketId){
		io.sockets.sockets[tesSocketId].emit('news',data.toString());
	}
	// getId('111')
	//ios.sockets.sockets[tesSocketId].send('news', data.toString()) ;
	//  io.sockets.sockets[tesSocketId].emit('news',data.toString()) ;
	//sock.emit('news', data.toString());
}

function getId(imei){
	if(diviseOnline[imei]){
		return diviseOnline[imei]['sockId'];
	}
	return false;
}

exports.pushConnect=function(socket,data){ //получаем данные от клиента в первом соединении
	var obj={};

	data=data.replace(/\s/g,'');
	var arr=data.split(';');
	for(var i=0; i<arr.length; i++){
		obj[arr[i].split('=')[0]]=arr[i].split('=')[1];
	}
	mysql.checkCoocies(obj.user,null,obj.key,function(val){
		if(val){
			mysql.getDevice(obj.user,function(dev){
				if(dev){
					dev=dev.replace(/\r\n/g,"\n");
					var devices=JSON.parse(dev);
					for(var i=0; i<devices.length; i++){
						diviseOnline[devices[i]['imei']]={user:obj.user,sockId:socket.id};
						tesSocketId=socket.id;
						console.log(('user and key: '+diviseOnline[devices[i]['imei']]['user']+' : '+diviseOnline[devices[i]['imei']]['sockId']).green);
					}
				}
			})
		}
	})
}

exports.clearData=function(_id){
	for(var option in diviseOnline){
		if(diviseOnline[option]['sockId']==_id){
			delete diviseOnline.option;
			console.log('data clear');
		}
	}
}

exports.parseData=function(sock){
	var params;
	// var lat, lng, datatime, speed, sputnik, zaryad, azimut;
	//$GM231869158002854111T 161012 161240 N50233157E03029611200024995730298#
	//$GM231869158002854111T161012161240N50233157E03029611200024995730298#
	//$GM209869158002854111T161113135057_00000000_00000000000006005930283#

	console.log('CONNECTED: '+sock.remoteAddress+':'+sock.remotePort);

	sock.on('data',function(data){
		gpsmarker.imei(data.toString());
		console.log('imei: '+gpsmarker.imei(data))
		sock.write(gpsmarker.res(data));
		var params=gpsmarker.params(data);
		gpsmarker.save(params);


		if(diviseOnline[gpsmarker.imei(data)]){
			var sockId=diviseOnline[gpsmarker.imei(data)]['sockId'];
			// io.sockets.sockets[sockId].emit('news', data.toString());
			try{
				io.sockets.sockets[sockId].emit('news',params);
			}catch(err){
				console.log('remove sockId'.green);
				delete  diviseOnline[gpsmarker.imei(data)]['sockId'];
			}

		}
	});
	sock.on('close',function(data){
		console.log('CLOSED: '+sock.remoteAddress+' '+sock.remotePort);
		//  delete parser;
	});
}

exports.parseDataGpsLogger=function(sock){
	console.log('CONNECTED GpsLogger: '+sock.remoteAddress+':'+sock.remotePort);
	sock.on('data',function(data){
		sock.end('ok');

		console.log('GpsLogger send: '+data.toString());
		gpslogger.imei(data.toString());
		//console.log('imei: '+gpslogger.imei(data))
		var params=gpslogger.params(data);
		for(var opt in params){
			console.log(opt+':'+params[opt])
		}

		gpslogger.save(params);

		if(diviseOnline[gpslogger.imei(data)]){
			var sockId=diviseOnline[gpslogger.imei(data)]['sockId'];
			try{
				io.sockets.sockets[sockId].emit('news',params);
			}catch(err){
				delete  diviseOnline[gpslogger.imei(data)]['sockId'];
			}

		}
	}).on('close',function(data){
			console.log('GpsLogger end connection');
		});
}

exports.GpsLogger=function(net){
	var scope=this;
	net.createServer(function(sock){
		scope.parseDataGpsLogger(sock);
	}).listen(10100,'0.0.0.0',function(){
			console.log('GpsLogger listening 10100');
		});
}

exports.GPSMarker=function(net){
	var scope=this;
	net.createServer(function(sock){
		// scope.parseData(sock); //заблочено
		sock.on('data',function(data){
			console.log('GPSMarker: '+data);
			if (gpsmarker.valid(data.toString())){

				console.log('GPSMarker valid');
			}else{
				sock.end('Ololo');
			}

		})
		sock.on('close',function(data){
			console.log('CLOSED: GPSMarker');
			//  delete parser;
		});
		sock.on('error', function(err){
			console.log('3128: '+ err)
		})


	}).listen(3128,'0.0.0.0',function(){
			console.log('GPSMarker listening 3128');
		});

}

exports.GpsGate=function(net){
	net.createServer(function(sock){

		sock.on('data',function(data){
			console.log('GpsGate data: '+data)
		});
		sock.on('close',function(data){
			console.log('CLOSED: '+sock.remoteAddress+' '+sock.remotePort);
			//  delete parser;
		});

	}).listen(10005,'0.0.0.0',function(){
			console.log('GpsGate listening 10005');
		});
}