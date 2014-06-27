var devices = {
    el:null,
    init:function (html, css) {
        var scope = this;
        if (!this.el) {
            html;
            css;

            $('head').append(
                ' <style type="text/css" name="devices">' +
                    css +
                    ' </style>'
            );


            $('body').append(html);
            this.el = $('.device');

            $('.spoiler-device').hide();
            $('.spoiler-device').height($(window).height() - 30);
            $('.spoiler-device').slideToggle(200);
            $('.spoiler-device-title').click(function () {
                $('.spoiler-device').height($(window).height() - 30);
                $('.spoiler-device').slideToggle(200);
            });



            $('.device .device-uno').hover(
                function () {
                    $(this).addClass('hover');
                }, function () {
                    $(this).removeClass('hover');
                }
            );

            for (var opt in points) {
                scope.setParams(points[opt]);
                (function listener(imei, points) {
                    var elList = $('.device').find('div[name=' + opt + ']');
                    points[opt].marker.on('mouseover', function () {
                        elList.addClass('hover')
                    })
                    points[opt].marker.on('mouseout', function () {
                        elList.removeClass('hover');
                    })
                })(opt, points)
            }


        }
    },
    deviceOnClick:function (param, el) {
        if (points[param]) {
            app.map.panTo(
                [
                    points[param]['lat'],
                    points[param]['lng']
                ]
            );
			$('.report div[name=device]').html(points[param].name)
        } else {
            app.maskShow('Alert', 'Нет ни одной точки', function () {

            });
        }



    },
    setParams:function (point) {
        var el = $('.device').find('div[name=' + point.imei + ']');
        el.find('td[name=time]').html( '<p><nobr>'+  marker.parseTime.decode(point.datetime).date+'</nobr></p>'+'<p><nobr>'+marker.parseTime.decode(point.datetime).time+'</nobr></p>')
        el.find('td[name=sputnik]').html(point.sputnik);
        el.find('td[name=speed]').html(point.speed+'km/h');
        el.find('td[name=battery]').html(point.zaryad+' V');

        var active = marker.parseTime.active(point.datetime);
        if (active < 600) {//устройство активно
            if(point.speed && 0<point.speed){
                el.find('td[name=active]').html('<div class="move"></div>');
            }else{
                el.find('td[name=active]').html('<div class="stop"></div>');
            }

        }else{ //устройство не активно
            el.find('td[name=active]').html('<div class="nosignal"></div>');
        }

    }
}
