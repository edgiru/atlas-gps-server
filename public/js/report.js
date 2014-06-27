var report = {
    el:null,
    init:function (html, css) {
        if (!this.el) {
            var scope = this;
            $('head').append(
                ' <style type="text/css" name="report">' +
                    css +
                    ' </style>'
            );
            $('body').append(html);
            this.el = $('.report');








            $('.spoiler-report').hide();
            $('.spoiler-report').height($(window).height() - 30);
            $('.spoiler-report').slideToggle(200);
            $('.spoiler-report-title').click(function () {
                $('.spoiler-report').height($(window).height() - 30);
                $('.spoiler-report').slideToggle(200);
            });


            require([
                'lib/jquery/jquery-ui-timepicker-addon',
                'lib/requirejs/text!lib/jquery/jquery-ui-1.10.3.custom/css/ui-lightness/jquery-ui-1.10.3.custom.min.css'
            ], function (js,css) {
               $('style[name=report]').before(
                   ' <style type="text/css" name="custom">' +
                       css +
                       ' </style>'
               )
                /*
                $('head').append(

                );
                */


                scope.el.find('input').datetimepicker({
                    dateFormat:'dd/mm/yy',
                    beforeShow: function (input, inst) {
                        var offset = $(input).offset();
                        var height = $(input).height();
                        window.setTimeout(function () {
                            inst.dpDiv.css({ top: (offset.top + height -50) + 'px', left: (offset.left -50) + 'px' })
                        }, 1);
                    }
                })
                $('#ui-datepicker-div').draggable({ handle:".ui-datepicker-header" });
                scope.el.find('.button[name=show]').click(function () {
                    scope.el.find('input[name=from]').val();
                    scope.el.find('input[name=to]').val();
                    scope.show(
                        scope.el.find('input[name=from]').val(),
                        scope.el.find('input[name=to]').val(),
                        scope.el.find('div[name=device]').html()
                    )
                })
            })

        }

    },
    show:function (from, to, name) {
        var scope = this;
        if (from && to && name != '...') {
            var imei;
            for (var opt in points) {
                if (points[opt]['name'] == name) {
                    imei = points[opt]['imei']
                }
            }
            imei;
            from = marker.parseTime.incode(from)
            to = marker.parseTime.incode(to);

            $.ajax({
                url:'show_track',
                type:'POST',
                data:JSON.stringify({
                    from:from,
                    to:to,
                    imei:imei
                }),
                success:function (res) {
                    if (res == 'null') {
                        app.maskShow('Alert', 'Нет данных', function () {

                        })
                    } else {
                        scope.addToMap(res, imei, from, to);
                    }

                    // alert(res)
                },
                error:function (res) {
                    console.log(res)
                }
            })

        } else if (name == '' || name == '...') {
            app.maskShow('alert', 'Устройство не выбрано', function () {

            })
        } else if (from = '' || to == '') {
            app.maskShow('alert', 'не выбран период', function () {

            })
        }
    },
    addToMap:function (_arr, imei, from, to) {
        var scope = this;
        var f = parseFloat;
        var arr = JSON.parse(_arr);
        var nameTrack = '' + from + to;
        tracks = tracks ? tracks : {};
        if (!tracks[nameTrack]) {
            tracks[nameTrack] = {
                name:nameTrack,
                imei:imei,
                from:from,
                to:to,
                points:arr
            };

            var marker = [];
            var poly = [];

            for (var i = 0; i < arr.length; i++) {
                marker[i] = this.marker(arr[i]);
                scope.mouseover(marker[i], arr[i]);
                poly[i] = [f(arr[i].lat), f(arr[i].lng)];
            }

            function mouseover(marker, i) {
                marker.on('mouseover', function (e) {
                    var popup = L.popup()
                        .setLatLng(e.latlng)
                        .setContent(arr[i].datetime)
                        .openOn(app.map);
                })
            }

            tracks[nameTrack]['markers'] = L.featureGroup(marker).addTo(app.map);
            tracks[nameTrack]['polyline'] = L.polyline(poly, {color:'#0024ff', weight:'2', opacity:"0.7"}).addTo(app.map);
            require([
                'lib/leaflet/leaflet.polylineDecorator'
            ], function () {
               try{
                   tracks[nameTrack]['polylineDecorator'] = L.polylineDecorator(tracks[nameTrack]['polyline'], {
                       patterns:[
                           { offset:'5%', repeat:'100px', symbol:new L.Symbol.ArrowHead({pixelSize:10, polygon:false, pathOptions:{stroke:true, weight:2, color:'#0024ff', opacity:"0.7"}})}
                       ]
                   }).addTo(app.map);
               }catch (err){
                   console.log(err)
               }


                scope.divuno(tracks[nameTrack]);
            })
            for(var i = 0; i<arr.length; i++){
                scope.fillCanvas(arr[i])
            }

        }
    },
    marker:function (point) {
        var f = parseFloat;
        var latLng = [f(point.lat), f(point.lng)];
        var _id = 't' + point.id;
        var icon = L.divIcon({
            html:'<canvas width="10" height="10" style="position: absolute; top:0;left: 0"  id="' + _id + '" ></canvas>',
            iconSize:[10, 10],
            iconAnchor:[5, 5],
            className:'defaultMarker'
        })

        return L.marker(latLng, {icon:icon})
    },
    mouseover:function (_marker, point) {
        var content =
            points[point.imei].name + '</br>' +
                'Дата: ' + marker.parseTime.decode(point.datetime).date + '</br>' +
                'Время: ' + marker.parseTime.decode(point.datetime).time + '</br>' +
                (point.zaryad ? ('Батарея: ' + point.zaryad) : '') + '</br>' +
                'Скорость: ' + point.speed + ' km/h' + '</br>';
        _marker.on('mouseover', function (e) {
            var popup = L.popup({offset:[0, -2], minWidth:100})
                .setLatLng(e.latlng)
                .setContent(content)
                .openOn(app.map);

        })
    },
    divuno:function (track) {
        require([
            'lib/requirejs/text!views/track.html'
        ], function (html) {

            $('.report').append(
                $.tmpl(html, {
                    name:track.name,
                    fromdate:marker.parseTime.decode(track.from).date,
                    fromtime:marker.parseTime.decode(track.from).time,
                    todate:marker.parseTime.decode(track.to).date,
                    totime:marker.parseTime.decode(track.to).time
                })
            )
            var el = $('.report .track-uno[name=' + track.name + ']');
            el.fadeTo(222, 1);
            $('.report .track-uno[name=' + track.name + ']').hover(
                function () {
                    $(this).addClass('hover')
                    tracks[track.name]['polyline'].setStyle({weight:3})

                },
                function () {
                    $(this).removeClass('hover')
                    tracks[track.name]['polyline'].setStyle({weight:2})
                }
            )
            el.find('div.close').click(function () {
                app.map.removeLayer(tracks[track.name]['markers']);
                app.map.removeLayer(tracks[track.name]['polyline']);
                tracks[track.name]['polylineDecorator'] ? app.map.removeLayer(tracks[track.name]['polylineDecorator']):null;
                delete   tracks[track.name];
                $(this).unbind('click');
                el.fadeTo(222, 0, function () {
                    el.remove();
                })
            })
        })
    },
    fillCanvas: function(el){
      var canvas =  window['t'+el.id].getContext('2d');

        canvas.beginPath();
        canvas.arc(5, 5, 4, 0, 2 * Math.PI, false);
        canvas.fillStyle = '#fff';
        canvas.fill();
        canvas.lineWidth = 2;
        canvas.strokeStyle = 'blue';
        canvas.stroke();

    }
}
