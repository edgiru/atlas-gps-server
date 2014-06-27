atlas-gps-server
================

OpenSource GPS tracker system (monitoring) from user nick "Mars"

﻿### Описание
Этот сервер был разработан не мной, а одним хорошим человеком под ником Mars. Разработчик был не против свободного распространения и изменения исходников без лицензии.
Эта версия работает, но может вылетать из-за отсутствия валидации приходящих ложных или ошибочных пакетов. Любой неправильный запрос приведет к ошибке. Над этим нужно работать далее.. 

<img src="https://lh4.googleusercontent.com/-VGSeqHLH1pA/U61bmLLtodI/AAAAAAAAyXY/4VxkTXrWsws/w1152-h597-no/11111111.jpg" alt=""> 

#### Порядок установки и работы

1. Установить базу данных MySql. 
2. Импортировать в базу таблицы из фала nodemonitor.sql в в папке MySQL Должны создаться база данных nodemonitor в ней две таблицы -> log  и user

Или создать вручную базу "nodemonitor"

```js
log ->
CREATE TABLE IF NOT EXISTS `log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imei` text,
  `lat` text NOT NULL,
  `lng` text NOT NULL,
  `speed` int(11) NOT NULL,
  `datetime` text NOT NULL,
  `zaryad` text NOT NULL,
  `azimuth` int(11) NOT NULL,
  `sputnik` int(2) NOT NULL,
  `tc` text NOT NULL,
  `params` text NOT NULL,
  `sourcedata` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=104;
```

```js
user ->
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `pass` text NOT NULL,
  `key` text NOT NULL,
  `options` text NOT NULL,
  `device` text NOT NULL,
  `tracks` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;
```

#### Установить Node.js отсюда: http://nodejs.org/

Войти в черный экран (для виндовс Пуск -> Выполнить  : Набрать в окошке cmd и нажать Ok)<br>
Перейти в директорию куда вы разархивировали проект   D: ввод <br>
D:\>  cd ./atlas/webserver   ввод (или клавиша энтер ее называют)<br>
Должно получится <br>
D:\> atlas/webserver >   <br>

Далее в этой строчке набираете  D:\> atlas/webserver >   node web-server.js<br>
На этом этапе должна быть ошибка .. много надписей. В самом ER_ACCESS_DENITED_ERROR  бла бла… <br>

Это значит что сервер не может подсоединиться к базе данных. В файле папка webserver Фалик web-config.json <br>

```js
{
	"port": 5000,   
	"public" : "../public",  
	"mysql": {
		"host":"localhost",
		"user":"admin",		//"admin"  пользователь который имеет право подключиться к базе (часто это root)
		"password":"pass_from_database",	//"password"  пароль от этой базы данных. В нашем случае от базы nodemonitoring  меняете на свой
		"database":"nodemonitor"	//"database"  сама наша база (ее имя)
	}
}
````

Вам надо добиться чтобы при запуске сервер (выполнения команды в командной строке node web-server.js ) выдал сделующие строки:
```js
controllers add
Server listening on: 5000
GPSMarker listening 3128
GpsLogger listening 10100
GpsGate listening 10005
Profiler listening on 0.0.0.0:3131
```

Если удалось завести таблицы и стартовать сервер, открываем браузер и переходим по адресу<br>
http://localhost:5000<br>
5000 – это  "port": 5000,   web-config.json (вы можете изменить на любой другой свободный у вас порт к примеру: 80)

Если вы создавали таблицу в базе данных импортом, то по умолчанию можно войти под

login: demo<br>
pass:  demo

Сервер неустойчиво, но работает для GPS Logger for Android 

https://play.google.com/store/apps/details?id=com.mendhak.gpslogger&hl=ru

Его настроки:<br>
Настройки -> Автоматическая отрпавка – OpenGTS настройка<br>
Включить OpenGTS  -> галка<br>
Включить автоматическую отправку координат -> галка<br>
Сервер -> ip вашего сервера (нужно узнать ip вашего компьютера например по ссылке http://2ip.ru/ )<br>
Порт  - > 10100 (по умолчанию у меня забито среди кода)<br>
Идентификатор устройства – > 123456789012345  (по умолчанию для пользователя: demo пароль: demo)<br>

На этом этапе должно уже работать. 
