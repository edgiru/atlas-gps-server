-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Час створення: Трв 20 2014 р., 23:12
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
(1, 'demo', 'demo', 'f2c218214f6671317a28ecdc13a299f1', '{"map":"ggl","startCentre":{"lat":"50.44","lng":"30.52"},"gmt":"3","startZoom":"12"}', '[{"name":"logger","imei":"123456789012345"},{"name":"marker","imei":"869158002854111"}]', ''),
(4, 'mars', '111', '', '', '', ''),
(5, 'mmm', '111', 'dd10e67fdd6ce3ffc75561d642b0b4d5', '', '', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
