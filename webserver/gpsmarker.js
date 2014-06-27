var mysql=require('mysql');
var connection=mysql.createConnection({
	host:'localhost',
	user:'admin',
	password:'glider',
	database:'nodemonitor'
});


exports.valid=function(data){
data = ''+data;
	data=data.replace(/[\n\r]/g,'');
	data=data.replace(/\s/g,'');

	if(data.match('android')){
		return true
	}
	return null;
}


exports.imei=function(data){
	var text=''+data;
	var arr=text.split('');
	var imei='';
	for(var i=6; i<21; i++){
		imei+=arr[i];
	}
	return imei;
}
exports.res=function(data){
	var text=''+data;
	var arr=text.split('');
	var res='';
	for(var i=1; i<4; i++){
		res+=arr[i];
	}
	return '__'+res+'\r\n';
}
exports.params=function(data){
	//$GM231869158002854111T161012161240N50233157E03029611200024995730298#
	var sourcedata=''+data;
	var params;
	var text=''+data;
	var arr=text.split('');
	var imei=this.imei(data);
	var datetime='';
	var azimuth='';
	var lat='';
	var lng='';
	var speed='';
	var sputnik='';
	var zaryad='';
	var tc='';
	// 16 10 12

	datetime=''+arr[26]+arr[27]+arr[24]+arr[25]+arr[22]+arr[23]+arr[28]+arr[29]+arr[30]+arr[31]+arr[32]+arr[33];

	lat=(arr[34]=='N'?'+':'-')+arr[35]+arr[36]+'.'+arr[37]+arr[38]+arr[39]+arr[40]+arr[41]+arr[42];
	lat=parseFloat(lat);

	lng=(arr[43]=='E'?'+':'-')+arr[44]+arr[45]+arr[46]+'.'+arr[47]+arr[48]+arr[49]+arr[50]+arr[51]+arr[52];
	lng=parseFloat(lng);

	speed=''+arr[53]+arr[54]+arr[55];
	speed=parseFloat(speed);

	azimuth=''+arr[56]+arr[57]+arr[58];
	azimuth=parseFloat(azimuth);

	sputnik=arr[59];

	zaryad=''+arr[60]+'.'+arr[61];
	tc=''+arr[64]+arr[65]+arr[66];
	tc=parseFloat(tc);
	tc=(tc-272.15).toFixed(2);

	params={
		imei:imei,
		datetime:datetime,
		lat:lat,
		lng:lng,
		speed:speed,
		azimuth:azimuth,
		sputnik:sputnik,
		zaryad:zaryad,
		tc:tc,
		sourcedata:sourcedata
	}
	return params;
}

exports.save=function(data){
	connection.query('INSERT INTO log SET ?',data,function(err,result){
		if(err){
			console.log(err);
		}
	});
}
