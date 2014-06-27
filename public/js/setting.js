var setting = {
	el: null,
	init: function (html, css) {
		var scope = this;
		if (!this.el) {
			$('body').append($.tmpl(html, {
				"gmt": options.options.gmt,
				'lat': options.options.startCentre ? options.options.startCentre.lat : '',
				'lng': options.options.startCentre ? options.options.startCentre.lng : '',
				'zoom': options.options.startZoom
			}));
			var e = document.createElement("STYLE");
			e.type = "text/css";
			$('head').append(
				' <style type="text/css" name="setting">' +
					css +
					' </style>'
			);
			this.el = $('.item.setting').draggable({ handle:".title-item" });
			this.setDevices();
			this.el.find('.close').click(function () {
				scope.vhide()
			});
			this.el.find('.button[name=gmt]').click(function () {
				scope.changeGmt()
			})
			this.el.find('.button[name=zoom]').click(function () {
				scope.changeZoom()
			})
			this.el.find('.button[name=startLatLng]').click(function () {
				scope.startLatLng();
			})
			this.el.find('.button[name=getCenter]').click(function () {
				var el = $(this);
				if ($(this).hasClass('active')) {
					$(this).removeClass('active');
					app.map.off('click');
				} else {
					$(this).addClass('active');
					app.map.on('click', function (e) {
						//  alert(e.latlng); // e is an event object (MouseEvent in this case)
						scope.getCenter(e.latlng.lat, e.latlng.lng)
						el.removeClass('active');
						app.map.off('click');
					});
				}
				//  scope.getCenter();
			})
			this.el.fadeTo(222, 1);
		} else {
			this.vhide();
		}
	},
	vhide: function () {
		var scope = this;
		if (this.el.css('opacity') == 1) {
			this.el.fadeTo(222, 0, function () {
				scope.el.css('display', 'none')
			});
		} else {
			this.el.fadeTo(222, 1, function () {
				scope.el.css('display', 'inline')
			});
		}
	},
	setDevices: function () {
		var text = '<table>';
		text += '<tr  class="title-small">' +
			'<td class="text-center">' + 'Имя устройства' +
			'</td>' +
			'<td class="text-center">' + 'imei устройства' +
			'</td>' +
			'<td class="">' +
			'</td>'
		'</tr>';
		if (options.devices && options.devices.length) {
			for (var i = 0; i < options.devices.length; i++) {
				text +=
					'<tr>' +
						'<td>' + '<input style="" type="text" value="' + options.devices[i]['name'] + '">' +
						'</td>' +
						'<td>' + '<input style="" type="text" value="' + options.devices[i]['imei'] + '">' +
						'</td>' +
						'<td class="ico-del" onclick="setting.delDevice(' + '\'' + options.devices[i]['name'] + '\'' + ',' + '\'' + options.devices[i]['imei'] + '\'' + ')">'
				'</td>' +
				'</tr>'
			}
		}
		text += '<tr>' +
			'<td>' + '<input style="" type="text" name="newName" value="">' +
			'</td>' +
			'<td>' + '<input style="" type="text" name="newImei" value="">' +
			'</td>' +
			'<td class="ico-plus" onclick="setting.addDev()">' +
			'</td>'
		'</tr>';
		text += '</table>';
		this.el.find('.content').append(text)
	},
	delDevice: function (dev, imei) {

		app.maskShow('Удаление устройства', (dev + ' : ' + imei)
			,
			function () {
				$.ajax({
					url: 'deldev',
					type: 'POST',
					// dataType: 'json',
					data: JSON.stringify({
						dev: dev,
						imei: imei
					}),
					success: function (res) {
						app.maskShow('Alert', res, function(){
							window.location.href = '/login.html';
						} )

					},
					error: function (res) {
						console.log(res)
						alert(res);
					}

				})
			},
			function () {
				app.maskHide();
			})

	},
	addDev: function () {
		var dev = $('.setting input[name="newName"]').val();
		var imei = $('.setting input[name="newImei"]').val();
		if (dev && imei) {
			$.ajax({
				url: 'newdev',
				type: 'POST',
				// dataType: 'json',
				data: JSON.stringify({
					dev: dev,
					imei: imei
				}),
				success: function (res) {
					app.maskShow('Alert', res, function(){
						window.location.href = '/login.html';
					})

				},
				error: function (res) {
					console.log(res)
					alert(res);
				}
			})
		} else {
			app.maskShow('Alert', 'Некорректные данные', function(){})
		}
	},
	alertMask: function (title, mess, ok, cancel) {
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
		$('body').append(
			'<div class="mask" style="position: fixed; z-index: 4; width:' + $(window).width() + 'px;height:' + $(window).height() + 'px ">' +
				'</div>'
		);
		$('.mask').fadeTo(222, 0.5);
		require([
			"lib/requirejs/text!views/dialog.html"
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
	},
	changeGmt: function () {
		// alert();
		var scope = this;
		var data = {
			gmt: this.el.find('input[name=gmt]').val()
		}
		$.ajax({
			url: 'setoption',
			type: 'POST',
			// dataType: 'json',
			data: JSON.stringify(data),
			success: function (res) {
				//alert(res)
				app.maskShow('Alert', 'Изменения внесены', function(){

				})
				/*
				scope.alertMask('Gmt', 'Изменения внесены', function () {
					scope.el.find('.gmt-input[name=gmt]').val(data.gmt)
				})
				*/

			},
			error: function (res) {
				console.log(res)
				alert('not save')
			}
		})
	},
	changeZoom: function () {
		var scope = this;
		var data = {
			startZoom: this.el.find('input[name=zoom]').val()
		}
		$.ajax({
			url: 'setoption',
			type: 'POST',
			// dataType: 'json',
			data: JSON.stringify(data),
			success: function (res) {
				app.maskShow('zoom', 'Изменения внесены', function(){
					window.location.href = '/login.html';
				})
			},
			error: function (res) {
				console.log(res)
				alert('not save')
			}
		})

	},
	startLatLng: function () {
		var scope = this;
		var data = {
			startCentre: {
				lat: scope.el.find('input[name=lat]').val(),
				lng: scope.el.find('input[name=lng]').val()
			}
		}
		$.ajax({
			url: 'setoption',
			type: 'POST',
			data: JSON.stringify(data),
			success: function (res) {
				app.maskShow('Center', 'Изменения внесены', function(){
					window.location.href = '/login.html';
				})
			},
			error: function (res) {
				console.log(res)
				alert('not save')
			}
		})
	},
	getCenter: function (lat, lng) {
		this.el.find('input[name=lat]').val(parseFloat(lat).toFixed(2));
		this.el.find('input[name=lng]').val(parseFloat(lng).toFixed(2));
	}
}

