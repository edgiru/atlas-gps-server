var app = {
	map: null,
	mask: null,
    loadTile: null,
	init: function () {
		this.drawMap();
		this.changeMap();
		this.dinLoad();
		this.fistPosition();
	},
	drawMap: function () {
		var scope = this;
		var osm, ggl, gglsats, mapOptions, mapOptionsString, cloudmade;
		options.options = options.options ? options.options : {};
		options.options.startCentre ? options.options.startCentre : {}

		this.map = new L.Map('map', {center: new L.LatLng(
			options.options.startCentre ? (options.options.startCentre.lat ? options.options.startCentre.lat : 50) : 50,
			options.options.startCentre ? (options.options.startCentre.lng ? options.options.startCentre.lng : 30) : 30
		), zoom: (options.options.startZoom ? options.options.startZoom : 8), closePopupOnClick: false, fadeAnimation: false });

		osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
		ggl = new L.TileLayer('http://mt0.googleapis.com/vt/lyrs=m@207000000&hl=ru&src=api&x={x}&y={y}&z={z}&s=Galile', {maxZoom: 18, minZoom: 3});
		gglsats = new L.TileLayer('https://khms1.google.com/kh/v=142&src=app&x={x}&s=&y={y}&z={z}&s=Gali', {maxZoom: 18, minZoom: 3});
		cloudmade = new L.TileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
			attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
			key: 'BC9A493B41014CAABB98F0471D759707',
			styleId: 22677
		})
		mapOptions = {'OSM': osm, 'Google': ggl, 'Google sat': gglsats, 'Cloudmade': cloudmade  };
		this.map.addControl(new L.Control.Layers(mapOptions));

		switch (options.map) {
			case 'ggl':
				options.map = ggl;
				break
			case 'gglsats':
				options.map = gglsats;
				break
			case 'osm':
				options.map = osm;
				break
			case 'cloudmade':
				options.map = cloudmade;
				break
			default:
				options.map = ggl;
		}
        options.map.on('load',function(){
            if(!scope.loadTile){
                scope.loadTile = true;

                setTimeout(function () {
                    require([
                        'socket.io/socket.io'
                    ], function () {
                            socketio();
                        }
                    )
                }, 1000)
            }


        })
		this.map.addLayer(options.map);


		//  var yndx = new L.Yandex();
		// var ytraffic = new L.Yandex("null", {traffic:true, opacity:0.8, overlay:true});
		//   var ytraffic = new L.Yandex("null", {traffic:true, opacity:0.8, overlay:true});
		//   map.addControl(new L.Control.Layers( {'OSM':osm, 'Google':ggl, 'Google sat':gglsats , "Yandex":yndx   }, {"Пробки":ytraffic} ));
	},
	changeMap: function () {
		var mapOptionsString = {'OSM': 'osm', 'Google': 'ggl', 'Google sat': 'gglsats', 'Cloudmade': 'cloudmade'  };
		$('.leaflet-control-layers-selector').click(function () {
			var el = this;
			var index = $(this).parent().index(); //индекс выбранной карты
			var value = $(this).parent().children('span').html(); //нектовое значение
			value = value.replace(/\s/, '');
			value = {
				map: mapOptionsString[value]
			};
			app.ajaxPost('setoption', value)

		})
	},
	ajaxPost: function (url, data, success) {
		$.ajax({
			url: url,
			type: 'POST',
			data: JSON.stringify(data),
			success: function (res) {

			},
			error: function (res) {
				console.log(res)
			}
		})
	},
	dinLoad: function () {
		var _require = null;
		$('[option]').click(function () {
			getS($(this).attr('option'))
		})
		function getS(url) {
			require([
				'lib/jquery/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom',
				//'lib/requirejs/text!lib/jquery/jquery-ui-1.10.3.custom/css/ui-lightness/jquery-ui-1.10.3.custom.min.css',
				'lib/jquery/jquery.tmpl.min'
			], function (js, css) {
				/*
                if (!_require) {
					var e = document.createElement("STYLE");
					e.type = "text/css";

					$('head').append('<style type="text/css" name="jquery-ui">' + css + ' </style>');
					_require = true;
				}
                */
				getR(url);
			});
			function getR(url) {
				require(["lib/requirejs/text!views/" + url + ".html",
					"lib/requirejs/text!css/" + url + ".css",
					"js/" + url],
					function (html, css) {
						window[url].init(html, css);
					}
				)
			}
		}
	},
	fistPosition: function () {
		points = {};
		if (options.lastData && options.lastData.length) {
			options.lastData.forEach(function (el, index) {
				if (el) {
					points[el['imei']] = el;
					marker.setMark(points[el['imei']], el)
				}
			});

            setInterval(
                function(){
                    marker.checkActive.call(marker)
                }, 60000)
		}
	},
	maskShow: function (title, mess, ok, cancel) {
		require([
			"lib/requirejs/text!css/dialog.css",
			'lib/requirejs/text!lib/jquery/jquery-ui-1.10.3.custom/css/ui-lightness/jquery-ui-1.10.3.custom.min.css'
		], function (css, css2) {
			if (!$('style[name=dialog]').length) {
				var e = document.createElement("STYLE");
				e.type = "text/css";
				$('head').append(
					' <style type="text/css" name="dialog">' +
						css +
						' </style>'
				);
			}
			if (!$('style[name="jquery-ui"]').length) {
				var e = document.createElement("STYLE");
				e.type = "text/css";
				$('head').append('<style type="text/css" name="jquery-ui">' + css2 + ' </style>');
			}
			show(title, mess, ok, cancel);
		})
		function show(title, mess, ok, cancel) {
			var buttons = [];
			if (ok) {
				buttons.push(
					{
						text: "OK",
						click: function () {
							ok();
							$(this).dialog("close");
						}
					}
				)
			}

			if (cancel) {
				buttons.push(
					{
						text: "cancel",
						click: function () {
							cancel();
							//$(this).dialog("close");
						}
					}
				)
			}


			$('body').append(
				'<div class="mask" style="position: fixed;top: 0; z-index: 4; width:' + $(window).width() + 'px;height:' + $(window).height() + 'px ">' +
					'</div>'
			);
			$('.mask').fadeTo(222, 0.5);
			require([
				"lib/requirejs/text!views/dialog.html",
				"lib/jquery/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom"

			],
				function (html, css) {
					$('body').append(html);
					$("#dialog").dialog({
						close: function () {
							$('.mask').fadeTo(222, 0, function () {
								$(this).remove();
							});
							$(this).remove();
						},
						dialogClass: 'alert-dialog',
						buttons: buttons
					});
					$('.alert-dialog .ui-dialog-buttonset').addClass('cb');
					$('.alert-dialog .ui-dialog-title').html(title);
					$('.alert-dialog .mess').html('<span>' + mess + '</span>')
				}
			);
		}

	},
	maskHide: function () {
		$("#dialog").dialog('close')
	},
	exit: function () {

		app.maskShow('Подтвердите действие', 'Выйти из системы?',
			function () {
				document.cookie = 'key=null';
				window.location.href = '/';
			},
			function () {
				app.maskHide();
			}

		)


	}
}
