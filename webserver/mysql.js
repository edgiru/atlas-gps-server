var config = require('./web-config.json');
var mysql = require('mysql');

var connection = mysql.createConnection(config.mysql);

connection.connect();

exports.checkPass = function (login, pass, key, success) {
    connection.query('SELECT * FROM user WHERE name = ?', [login], function (error, result, fields) {
        if (error) {
            console.log('Data Base Error');
            throw error;
            success(false);
            return false;
        }
        if (0 < result.length) {
            if (result[0]['name'] == login && result[0]['pass'] == pass) {
                console.log('pass' + pass);
                var post = {name:login, key:key};
                connection.query('UPDATE `nodemonitor`.`user` SET `key` = ? WHERE `user`.`name` = ?', [key, login], function (err, result) {
                   if (err){
                       throw error;
                       console.log('myyyy2'+error);
                       return null;
                   }
                    console.log(post.key);
                    success(true);
                });
            } else {
                success(false);
                return false;
            }
        } else {
            success(false);
            return false;
        }
        ;

    });
}

exports.checkCoocies = function (login, pass, key, success) {
    console.log('checkCoocies: ' + login);
    connection.query('SELECT * FROM user WHERE name = ?', [login], function (error, result, fields) {
        if (error) {
            throw error
            console.log('Data Base Error');
            // connection.end();
            success(false);
            return false;
        } else {
            // console.log(result);
            if (result && result.length) {
                if (result[0]['name'] == login && result[0]['key'] == key) {
                    // connection.end();
                    success(true);
                } else {
                    // connection.end();
                    success(false);
                    return false;
                }
            } else {
                //  connection.end();
                success(false);
                return false;
            }

        }
    })
}

exports.getDevice = function (login, success) {
    connection.query('SELECT * FROM user WHERE name = ?', [login], function (error, result, fields) {
        if (error) {
            throw error;
            console.log('Data Base Error');
            success(false);
            return false;
        } else {
            success(result[0]['device'], result[0]['options']);
            //getLastData();
        }
    })
}

exports.getLastData = function(devices, success) {
    /*
    var devices = [
        '869158002854111',
        '869158002854112'
    ]
    */
    var count = 0;
    var result = [];

    var s = function (res) {
        result.push(res);
        count++;
        if (count == devices.length) {
             success(result);
            console.log(result)
        }
    }
	if(devices && devices.length){
		for (var i = 0; i < devices.length; i++) {
			getResult(devices[i]['imei'], function (res) {
				s(res);
			})
		}
	}else{
		success(null);
	}

    function getResult(imei, success) {
        connection.query('SELECT * FROM log WHERE imei = ? ORDER BY `datetime` DESC LIMIT 1 ', [imei], function (error, result, fields) {
            if (error) {
                throw error;
                console.log(error)
                success(null);
            } else {
                success(result[0]);
                // console.log('last datetime: '+ result[0]['datetime'])
            }
        })
    }
}

exports.saveOptions = function (login, data, success) {
    connection.query('SELECT * FROM user WHERE name = ?', [login], function (error, result, fields) {
        if (error) {
            throw error;
            console.log('Data Base Error');
            success(false);
            return false;
        } else {
            var getOptions = result[0]['options'] ? result[0]['options'] : {};
            var setOptions = data; // опции которые нужно сохранить
            if (getOptions) {
                try {
                    getOptions = JSON.parse(getOptions); //текущие опции из базы
                } catch (err) {
                    console.log('cannot parse db opt')
                }
            }
            for (var option in setOptions) {
                getOptions[option] = setOptions[option]
            }
            setOptions = JSON.stringify(getOptions);

            connection.query('UPDATE `nodemonitor`.`user` SET `options` = ? WHERE `user`.`name` = ?', [setOptions, login], function (err, result) {
                //   console.log(post.key);
                if (err){
                    throw error;
                    console.log('mysql3'+error)
                }
                console.log('setOptions: ' + setOptions);
                success(true);
            });

            //   console.log('getOptions.map: '+getOptions.map + ' setOptions.map:' + setOptions.map);
            // success(true);
        }
    })

}

exports.recordLog = function (params, data, success) {


}