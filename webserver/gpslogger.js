var mysql = require('mysql');
var config = require('./web-config.json');
var connection = mysql.createConnection(config.mysql);

/*

 GET /?alt=0.0&code=0xF020&id=123456789012345&gprmc=%24GPRMC%2C191019.951%2CA%2C5023.32513%2CN%2C3029.62911%2CE%2C0.000000%2C0.000000%2C301213%2C%2C*3A HTTP/1.1
 Host: 31.131.16.130:10100
 Connection: Keep-Alive
 User-Agent: android-async-http/1.4.1 (http://loopj.com/android-async-http)
 Accept-Encoding: gzip
 */


exports.imei = function (data) {
    var text = '' + data;
    text = text.split('HTTP')[0];
    text = text.replace(/\s/g, "");
    text = text.replace(/GET/g, "");


    var arr = text.split('&');
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i].split('=')[0]] = arr[i].split('=')[1]
    }
    /*
     for(var opt in obj){
     console.log(opt + ': '+obj[opt] );
     }
     text  = obj['gprmc'];
     */

    var imei = '' + obj['id'];

    return imei;
}
exports.res = function (data) {
    var text = '' + data;
    var arr = text.split('');
    var res = '';
    for (var i = 1; i < 4; i++) {
        res += arr[i];
    }
    return '__' + res + '\r\n';
}
exports.params = function (data) {
    //$GM231869158002854111T161012161240N50233157E03029611200024995730298#
    var sourcedata;
    var params;
    var text = '' + data;

    var imei = this.imei(data);


    var text = '' + data;
    text = text.split('HTTP')[0];
    text = text.replace(/\s/g, "");
    text = text.replace(/GET/g, "");


    var arr = text.split('&');
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i].split('=')[0]] = arr[i].split('=')[1]
    }
    text = obj['gprmc'];
    sourcedata = obj['gprmc'];
    //gprmc: %24GPRMC%2C195638.586%2CA%2C5023.32668%2CN%2C3029.63043%2CE%2C0.000000%2C0.000000%2C301213%2C%2C*3D
    //gprmc: %24GPRMC%2C195638.586%2CA%2C5023.32668%2CN%2C3029.63043%2CE%2C0.000000%2C0.000000%2C301213%2C%2C*3D
    arr = text.split('%2C');
    //   0        1        2       3       4       5      6     7           8       9       10
    //%24GPRMC  195638.586  A  5023.32668  N  3029.63043  E  0.000000  0.000000  301213    *3D
    //%24GPRMC  201429.000  A  5023.45080  N  3029.60190  E  0.000000  46.380001  301213    *0E

    var datetime = '';
    var azimuth = '';
    var lat = '';
    var lng = '';
    var speed = '';
    var sputnik = '';
    var zaryad = '';
    var tc = '';
    //
    var mm
    datetime = '' +arr[9].split('')[4]+arr[9].split('')[5]+arr[9].split('')[2]+arr[9].split('')[3]+arr[9].split('')[0]+arr[9].split('')[1]+arr[1].split('.')[0];

    lat = (arr[4] == 'N' ? '+' : '-') + arr[3];
    lat = parseFloat(lat);
    lat = lat/100;

    lat = ''+lat;
    mm = lat.split('.')[1];
    mm = parseFloat(mm);
    mm =100 * mm/60;

    lat = Math.floor(lat);
    lat = '' + lat +'.'+mm;
    lat = parseFloat(lat);

    lng = (arr[6] == 'E' ? '+' : '-') + arr[5];

    lng = lng/100;

    lng = ''+lng;
    mm = lng.split('.')[1];
    mm = parseFloat(mm);
    mm =100 * mm/60;

    lng = Math.floor(lng);
    lng = '' + lng +'.'+mm;

    lng = parseFloat(lng);

    speed = '' + arr[7];
    speed = parseFloat(speed);

    azimuth = '' + arr[8];
    azimuth = parseFloat(azimuth);

    sputnik = '';

    zaryad = '' ;
    tc = '';


    params = {
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

exports.save = function (data) {
    connection.query('INSERT INTO log SET ?', data, function (err, result) {
        if (err) {
            console.log(err);
        }
    });
}
