Порядок работы.
1. Установить базу данных MySql. 
2. Импортировать в базу таблицы из фала nodemonitor.sql в корне архива
Должны создаться база данных nodemonitor   в ней две таблицы -> log  и user


Или создать вручную базу nodemonitor;
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=104 ; 

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

Установить Node.js   http://nodejs.org/

Войти в черный экран (для виндовс Пуск -> Выполнить  : Набрать в окошке cmd и нажать Ok)
Перейти в директорию куда вы разархивировали проект   D: ввод 
D:\>  cd ./atlas/webserver   ввод (или клавиша энтер ее называют)
Должно получится 
D:\> atlas/webserver >   

Далее в этой строчке набираете  D:\> atlas/webserver >   node web-server.js
На этом этапе должна быть ошибка .. много надписей. В самом ER_ACCESS_DENITED_ERROR  бла бла… 

Это значит что сервер не может подсоединиться к базе данных. В файле папка webserver Фалик web-config.json 
{
	"port": 5000,   
	"public" : "../public",  
	"mysql": {
		"host":"localhost",
		"user":"admin",	 
		"password":"pass_from_database",
		"database":"nodemonitor"
	}
}
__________________________
"admin"  пользователь который имеет право подключиться к базе (часто это root)
"password"  пароль от этой базы данных. В нашем случае от базы nodemonitoring  меняете на свой
"database"  сама наша база (ее имя).

Вам надо добиться чтобы в итоге при запуске сервер (выполнения команды в командной строке node web-server.js )  в итоге сервер запустился. 


Если удалось завести таблицы и стартовать сервер, открываем браузер и переходим по адресу
http://localhost:5000  
5000 – это  "port": 5000,   web-config.json (у меня просто 80 порт занят Apache, Вы можете регулирвать)

Если вы создавали таблицу в базе данных импортом, то по умолчанию можно войти под 
demo
demo
.

Сервер неустойчиво, но работает для GPS Logger for Android 
https://play.google.com/store/apps/details?id=com.mendhak.gpslogger&hl=ru


Его настроки:
Настройки -> Автоматическая отрпавка – OpenGTS настройка
Включить OpenGTS  -> галка
Включить автоматическую отправку координат -> галка
Сервер -> ip вашего сервера (нужно узнать ip вашего компьютера например по ссылке http://2ip.ru/ )
Порт  - > 10100 (по умолчанию у меня забито среди кода)
Идентификатор устройства – > 123456789012345  (по умолчанию для пользователь demo demo)

На этом этапе должно уже работать. 

Сервер не отлажен. В основном по тому что нет проверок на валидацию приходящих данных. Любой неправильный запрос приведет к ошибке. Над этим нужно работать далее..