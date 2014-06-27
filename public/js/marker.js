/**
 * Created with JetBrains WebStorm.
 * User: Администратор
 * Date: 12/23/13
 * Time: 6:42 PM
 * To change this template use File | Settings | File Templates.
 */
var marker = {
    count:0,
    div:function (point) {
        return L.divIcon({
            html:'<canvas width="24" height="24"  id="cnv' + point.imei + '" ></canvas>',
            iconSize:[24, 24],
            iconAnchor:[12, 12],
            className:'defaultMarker'
        })
    },
    cnvStop:function (canvas) {
        canvas.beginPath();
        canvas.arc(12, 12, 7, 0, 2 * Math.PI, false);
        canvas.fillStyle = '#ffa509';
        canvas.fill();
        canvas.lineWidth = 1;
        canvas.strokeStyle = 'red';
        canvas.stroke();
    },
    cnvNoSignal:function (canvas) {
        canvas.fillStyle = '#ffff00';
        canvas.fillRect(4, 4, 16, 16);
        canvas.strokeStyle = 'red';
        canvas.lineWidth = 1;
        canvas.strokeRect(4, 4, 16, 16);
    },
    cnvMove:function (canvas, azimuth) {
        canvas.translate(12, 12);
        canvas.rotate(this.degree(azimuth));
        canvas.scale(1.1, 1.1);

        canvas.beginPath();
        canvas.moveTo(0, 0);
        canvas.moveTo(0, -10);
        canvas.lineTo(7, 7);
        canvas.lineTo(0, 0);
        canvas.fillStyle = '#007ae3';
        canvas.fill();


        canvas.beginPath();
        canvas.moveTo(0, 0);
        canvas.moveTo(7, 7);
        canvas.lineTo(0, 3);
        canvas.lineTo(0, 0);
        canvas.fillStyle = '#0064a4';
        canvas.fill();

        canvas.beginPath();
        canvas.moveTo(0, 0);
        canvas.moveTo(0, 3);
        canvas.lineTo(-7, 7);
        canvas.lineTo(0, 0);
        canvas.fillStyle = '#00396f';
        canvas.fill();

        canvas.beginPath();
        canvas.moveTo(0, 0);
        canvas.moveTo(-7, 7);
        canvas.lineTo(0, -10);
        canvas.lineTo(0, 0);
        canvas.fillStyle = '#00e5ff';
        canvas.fill();

        //cnv.translate(1, 0);
        canvas.beginPath();
        canvas.lineWidth = 1;
        canvas.strokeStyle = '#003557';
        canvas.moveTo(0, -10);
        canvas.lineTo(7, 7);
        canvas.lineTo(0, 3);
        canvas.lineTo(-7, 7);
        canvas.lineTo(0, -10);
        canvas.stroke();
    },
    setMark:function (point) {
        this.count++;
        var active = this.parseTime.active(point.datetime);
        var elList = $('.device').find('div[name=' + point['imei'] + ']');
        elList.addClass('hover');

        point['marker'] = L.marker([point.lat, point.lng], {icon:this.div(point)}).addTo(app.map);
        points[point.imei].marker = point['marker'];

        point['marker'].bindPopup(marker.parseTime.decode(point.datetime).date + '</br>' + marker.parseTime.decode(point.datetime).time, {offset:[0, -5]})
        for (var i = 0; i < options.devices.length; i++) {
            if (options.devices[i].imei == points[point.imei]['imei']) {
                point['name'] = points[point.imei]['name'] = options.devices[i]['name'];
                point['phone'] = points[point.imei]['phone'] = options.devices[i]['phone'] ? options.devices[i]['phone'] : null;
            }
        }
        points[point.imei]['popup'] = L.popup({autoPan:false, offset:[0, -5]})
            .setLatLng([point.lat, point.lng])
            .setContent(point['name'] + '</br>' + (point['phone'] ? point['phone'] : ''))
            .addTo(app.map);
        for (var opt in point) {
            points[point.imei][opt] = point[opt]
        }


        elList.removeClass('hover');
        point['marker'].on('mouseover', function () {
            elList.addClass('hover')
        })
        point['marker'].on('mouseout', function () {
            elList.removeClass('hover');
        })
        var canvas = window['cnv' + point.imei].getContext('2d');
        if (active < 600) {//устройство активно
            if (point.speed && 0 < point.speed) {
                this.cnvMove(canvas, point.azimuth);//устройство движется
                points[point.imei]['status'] = 'move'
            } else {
                this.cnvStop(canvas); //устройство стоит
                points[point.imei]['status'] = 'stop'
            }

        } else { //устройство не активно
            this.cnvNoSignal(canvas);
            points[point.imei]['status'] = 'noSignal'
        }

    },
    parseTime:{
        active:function (time) {
            var f = parseFloat;
            var dayInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30];
            var dayInMonthLeap = [0, 31, 29, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30];

            var date = new Date();
            var leapYear = [2016, 2020, 2024, 2028];

            function checkLapYwer(y) {
                for (var i = 0; i < leapYear.length; i++) {
                    if (y == leapYear[i]) {
                        return true;
                    }
                }
                return false;
            }

            var yy = date.getFullYear() + '';
            var currentTime = {
                yy:yy.split('')[2] + yy.split('')[3],
                mm:(date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : '' + (date.getMonth() + 1),
                dd:(date.getDate() < 10) ? ('0' + date.getDate()) : '' + date.getDate(),
                hh:(date.getHours() < 10) ? ('0' + date.getHours()) : '' + date.getHours(),
                mi:(date.getMinutes() < 10) ? ('0' + date.getMinutes()) : '' + date.getMinutes(),
                ss:(date.getSeconds() < 10) ? ('0' + date.getSeconds()) : '' + date.getSeconds()
            }

            var arrtime = time.split('');
            var timeProtocol = {
                yy:'' + arrtime[0] + arrtime[1],
                mm:'' + arrtime[2] + arrtime[3],
                dd:'' + arrtime[4] + arrtime[5],
                hh:'' + arrtime[6] + arrtime[7],
                mi:'' + arrtime[8] + arrtime[9],
                ss:'' + arrtime[10] + arrtime[11]
            }
            var timeProtocolPlusGmt = this.plusGmt(timeProtocol);
            var different;

            //сколько секунд с начала года в посылке
            var ddYear = 0;
            for (var i = 0; i < parseFloat(timeProtocolPlusGmt.mm); i++) {
                if (checkLapYwer(date.getFullYear())) {
                    ddYear += dayInMonthLeap[i];
                } else {
                    ddYear += dayInMonth[i];
                }
            }
            var ssStartYearInProtocol; // секунд с начала года
            ssStartYearInProtocol = parseFloat(timeProtocolPlusGmt.ss) +
                (parseFloat(timeProtocolPlusGmt.mi) * 60) +
                (parseFloat(timeProtocolPlusGmt.hh) * 3600) +
                (parseFloat(timeProtocolPlusGmt.dd) * 3600 * 24) +
                (ddYear * 3600 * 24)+
                    ((f(timeProtocolPlusGmt.yy) -13) *ddLeap(timeProtocolPlusGmt.yy)*3600*24);
            //ssStartYearInProtocol = '' + timeProtocol.yy + ssStartYearInProtocol;
            ssStartYearInProtocol = parseFloat(ssStartYearInProtocol);
            // сколько секунд с начала года по текущее время
            var ddYearCurrent = 0;
            for (var i = 0; i < (date.getMonth() + 1); i++) {
                if (checkLapYwer(date.getFullYear())) {
                    ddYearCurrent += dayInMonthLeap[i];
                } else {
                    ddYearCurrent += dayInMonth[i];
                }
            }

            var ssStartYearCurrent;
            ssStartYearCurrent = parseFloat(currentTime.ss) +
                (parseFloat(currentTime.mi) * 60) +
                (parseFloat(currentTime.hh) * 3600) +
                (parseFloat(currentTime.dd) * 3600 * 24) +
                (ddYearCurrent * 3600 * 24) +
               ((f(currentTime.yy) -13) *ddLeap(currentTime.yy)*3600*24);
            ;
           // ssStartYearCurrent = '' + currentTime.yy + ssStartYearCurrent;
            ssStartYearCurrent = parseFloat(ssStartYearCurrent);


            function ddLeap (yy){
                yy= '20'+yy; yy = f(yy)
                for(var i = 0; i<leapYear.length; i++){
                    if (yy == leapYear[i]){
                        return 366
                    }
                }
                return 365
            }

            different = ssStartYearCurrent - ssStartYearInProtocol;
            return different;
        },
        plusGmt:function (time) {
            var date = time;
            date.hh = parseFloat(date.hh) + parseFloat(options.options.gmt);
            if (23 < date.hh) {
                date.hh = 24 - date.hh;
                date.dd = parseFloat(date.dd) + 1;
                if (date.dd < 10) {
                    date.dd = '0' + date.dd
                }
            }
            if (date.hh < 10) {
                date.hh = '0' + date.hh
            }

            date.hh = '' + date.hh;
            return date; //возвращаем 130401194156 дату + gmt
        },
        decode:function (_time) {
            //130401194156
            var arrtime = _time.split('');
            var timeProtocol = {
                yy:'' + arrtime[0] + arrtime[1],
                mm:'' + arrtime[2] + arrtime[3],
                dd:'' + arrtime[4] + arrtime[5],
                hh:'' + arrtime[6] + arrtime[7],
                mi:'' + arrtime[8] + arrtime[9],
                ss:'' + arrtime[10] + arrtime[11]
            }
            var time = this.plusGmt(timeProtocol);
            var date = {
                date:'' + time.dd + '/' + time.mm + '/' + time.yy,
                time:'' + time.hh + ':' + time.mi + ':' + time.ss
            }
            return date;
        },
        incode: function(time){
            var intime = time.split(' ');
            var d ={
                yy:''+intime[0].split('/')[2].split('')[2] +intime[0].split('/')[2].split('')[3] ,
                mm:intime[0].split('/')[1],
                dd:intime[0].split('/')[0],
                hh:intime[1].split(':')[0],
                mi:intime[1].split(':')[1],
                ss: '00'
            }
            d= this.minusGmt(d);
            var date =  ''+ d.yy+ d.mm+ d.dd+ d.hh+ d.mi+ d.ss;
            return date;
        },
        minusGmt:function(time){
            var dayInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30];
            var f= parseFloat;
            time.hh = f(time.hh)-f(options.options.gmt);
            if(time.hh<0){
                time.hh = time.hh+24;
                time.dd= f(time.dd)-1;
                if(time.dd<=0){
                    time.mm=f(time.mm)-1;
                    time.dd = dayInMonth[time.mm]
                }
            }
            for(var opt in time){
                time[opt] = f(time[opt]);
                if(time[opt]<10){
                    time[opt]='0'+time[opt]
                }else{ time[opt] = ''+time[opt]}
            }
            return time;
        },
        explode: function(time){
            var arrtime = time.split('');
            return {
                yy:'' + arrtime[0] + arrtime[1],
                mm:'' + arrtime[2] + arrtime[3],
                dd:'' + arrtime[4] + arrtime[5],
                hh:'' + arrtime[6] + arrtime[7],
                mi:'' + arrtime[8] + arrtime[9],
                ss:'' + arrtime[10] + arrtime[11]
            }
        }
    },
    degree:function (a) {
        return a * Math.PI / 180;
    },
    news:function (data) {
        app.map.removeLayer(points[data.imei].marker);
        app.map.removeLayer(points[data.imei].popup);


        if (points[data.imei]['follow']){
            app.map.panTo([data.lat, data.lng])
        }
        if (points[data.imei]['track']){
            if(points[data.imei]['trackPoly']){
                app.map.removeLayer(points[data.imei]['trackPoly']);
            }
            if(points[data.imei]['polylineDecorator']){
                app.map.removeLayer(points[data.imei]['polylineDecorator'])
            }
            points[data.imei]['arrPoly'] =  points[data.imei]['arrPoly'] ?  points[data.imei]['arrPoly'] : [[parseFloat(points[data.imei].lat),parseFloat(points[data.imei].lng)]];
            points[data.imei]['arrPoly'].push([data.lat, data.lng]);
            points[data.imei]['trackPoly'] =  L.polyline(points[data.imei]['arrPoly'],{color: '#ff0078',weight: '2', opacity: "1"}).addTo(app.map);
            points[data.imei]['polylineDecorator'] = L.polylineDecorator(points[data.imei]['trackPoly'], {
                patterns: [
                    { offset: '0%', repeat: '100px', symbol: new L.Symbol.ArrowHead({pixelSize: 10,  polygon: false, pathOptions: {stroke: true, weight: 2, color: '#ff0078', opacity: "0.9"}})}
                ]
            }).addTo(app.map);


        }
        this.setMark(data);
        devices ? devices.setParams(data) : null;

    },
    follow:function (imei, el) {
        devices.el.find('.eye').not(el).removeClass('on');
        for (var opt in points) {
            if (opt != imei) {
                points[opt]['follow'] = null;
            }
        }
        if ($(el).hasClass('on')) {
            $(el).removeClass('on')
            points[imei]['follow'] = null;
        } else {
            $(el).addClass('on');
            points[imei]['follow'] = true;
        }
    },
    track: function(imei, el){
        require([
            'lib/leaflet/leaflet.polylineDecorator'
        ],function(){
            if ($(el).hasClass('on')) {
                $(el).removeClass('on')
                points[imei]['track'] = null;
                points[imei]['arrPoly']=null;
                points[imei]['trackPoly'] ? app.map.removeLayer(points[imei]['trackPoly']):null;
                points[imei]['polylineDecorator']?app.map.removeLayer(points[imei]['polylineDecorator']):null;
                points[imei]['trackPoly'] = null;
            } else {
                $(el).addClass('on');
                points[imei]['track'] = true;
            }
        })
    },
    checkActive: function (){
        var active;
        for(var opt in points ){
            active  = this.parseTime.active(points[opt]['datetime']);
            if(600<active &&  points[opt]['status']!=='noSignal'){
              //  points[opt]['status'] = 'noSignal';
                points[opt]['popup'] ?  app.map.removeLayer(points[opt]['popup']): null;
                points[opt]['marker'] ?  app.map.removeLayer(points[opt]['marker']) : null;

                this.setMark(points[opt]);
                devices ? devices.setParams(points[opt]) : null;
            }
        }
    }
}
