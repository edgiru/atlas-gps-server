-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Час створення: Січ 01 2014 р., 19:50
-- Версія сервера: 5.5.25
-- Версія PHP: 5.3.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- БД: `nodemonitor`
--

-- --------------------------------------------------------

--
-- Структура таблиці `log`
--

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

--
-- Дамп даних таблиці `log`
--

INSERT INTO `log` (`id`, `imei`, `lat`, `lng`, `speed`, `datetime`, `zaryad`, `azimuth`, `sputnik`, `tc`, `params`, `sourcedata`) VALUES
(31, '11111111111111', '0', '0', 10, '131228124840', '5.7', 249, 9, '26', '', '$GM231869158002854111T161012161240N00000000E00029611200024995730298#');

-- --------------------------------------------------------

--
-- Структура таблиці `user`
--

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

--
-- Дамп даних таблиці `user`
--

INSERT INTO `user` (`id`, `name`, `pass`, `key`, `options`, `device`, `tracks`) VALUES
(1, 'demo', 'demo', '28550d850059ea7fcca88ff0eeb119ee', '{"map":"osm","startCentre":{"lat":"50.44","lng":"30.52"},"gmt":"2","startZoom":"12"}', '[{"name":"device","imei":"11111111111111"}]', ''),
(4, 'mars', '111', '', '', '', ''),
(5, 'mmm', '111', 'dd10e67fdd6ce3ffc75561d642b0b4d5', '', '', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
