-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Host: den1.mysql3.gear.host
-- Generation Time: Dec 18, 2017 at 12:52 PM
-- Server version: 5.7.19-log
-- PHP Version: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `retailmanagement`
--

-- --------------------------------------------------------

--
-- Table structure for table `administrator`
--

CREATE TABLE `administrator` (
  `AdminID` int(11) NOT NULL,
  `Address` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `Email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `Password` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `FName` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `LName` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `Username` varchar(20) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `administrator`
--

INSERT INTO `administrator` (`AdminID`, `Address`, `Email`, `Password`, `FName`, `LName`, `Username`) VALUES
(1, 'Paliyakotuwa/ Hettipola', 'tharindupradeep1@gmail.com', '1994', 'Tharindu', 'Pradeep', 'tharindu'),
(2, 'Paliyakotuwa/ Hettipola', 'tharindupradeep1@gmail.com', '$2a$10$lGhGHg3DiVt.KeFw8U0bgOcE.wvQ9eIZb6aQibDAhzDgyMZ7VAxSW', 'Tharindu', 'Rathnayake', 'thari');

-- --------------------------------------------------------

--
-- Table structure for table `billinginfo`
--

CREATE TABLE `billinginfo` (
  `CreditCardNo` int(11) NOT NULL,
  `CardExpiry` date NOT NULL,
  `CardSecPIN` int(11) NOT NULL,
  `CID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `CartId` int(11) NOT NULL,
  `CID` int(11) NOT NULL,
  `PID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Size` varchar(10) NOT NULL,
  `Colour` varchar(30) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`CartId`, `CID`, `PID`, `Quantity`, `Size`, `Colour`) VALUES
(19, 2, 1, 1, '', ''),
(20, 6, 2, 2, '', ''),
(21, 7, 1, 2, '', ''),
(22, 7, 3, 3, '', ''),
(27, 1, 1, 1, 'xl', 'black'),
(26, 1, 3, 1, 'm', 'white'),
(28, 1, 1, 2, 'xl', 'black'),
(29, 1, 1, 2, 'xl', 'black'),
(30, 9, 28, 1, '26', 'Pink'),
(31, 9, 28, 1, '26', 'Pink'),
(32, 9, 28, 1, '26', 'Pink'),
(33, 2, 20, 1, 'L', 'Black');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `CatDescription` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`CategoryID`, `CategoryName`, `CatDescription`) VALUES
(1, 'Frock', 'Frock fgfg'),
(3, 'Trouser', 'Trouser Category'),
(4, 'Blouse', 'Blouse with variety of choices'),
(5, 'Jacket', 'Gents Jacket'),
(6, 'Skirt', 'Skirt collection'),
(7, 'Saree', 'Indian sarees'),
(8, 'Shorts', 'Shorts collection'),
(10, 'Tshirt', 'Thirts collection');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `CID` int(11) NOT NULL,
  `Address` varchar(80) COLLATE utf8_unicode_ci NOT NULL,
  `Email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `Password` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `FName` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `LName` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `Username` varchar(20) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`CID`, `Address`, `Email`, `Password`, `FName`, `LName`, `Username`) VALUES
(1, 'Paliyakotuwa/ Hettipola', 'tharindupradeep1@gmail.com', '$2a$10$3xp93YUlYJt9UXFO8MS6heKljhDJnH9h8gDt2cKkoRgrHaFeRF.1a', 'Tharindu', 'Rathnayake', 'tharindu'),
(2, 'Paliyakotuwa/ Hettipola', 'tharindupradeep1ebay@gmail.com', '$2a$10$Pje/TG8cqp6tbRVbyIV//.B9GSzUWodWLcp2o2CYD9WU2quGqNE7y', 'Pasindu', 'Prabhath', 'pasindu'),
(3, 'Paliyakotuwa/ Hettipola', 'tharindupradeep1ebay@gmail.com', '$2a$10$rhFUX2ommHplhX0ezNnbluvrW9mOBErtI.x41KPC8YtE2mf9Uf7AW', 'Tharindu', 'Rathnayake', 'Thari'),
(4, 'Kuliyapitiya', '155071d@uom.lk', '$2a$10$X/4iJC0EcYb0lwSMJh6vmu3MFbVc2nU0SHo4YPHnFpaz/KIe1VnjK', 'Linali', 'Darsha', 'linali'),
(5, 'Kuliyapitiya', '155071d@uom.lk', '$2a$10$Y6FFgmQag2B5RmlJWlgfn.ph8a6hqxHV7GPAoo1mzAFxhYrRk5G3e', 'Linali', 'Darsha', 'linaliT'),
(6, 'Paliyakotuwa/ Hettipola', 'nethushikavya@gmail.com', '$2a$10$Dc2XsDsPmSkXaITJL10LcecCXDBnEcgf2TBJKNMGxaPbVjXN/X9Ai', 'Linali', 'Darsha', 'Linali_Darsha'),
(7, 'Tekewa/Hettipola', 'akilanimantha@gmail.com', '$2a$10$V0Z7/xm6OIWkubirXCBIgOVWperhQVYs26Y5GwAwgFsoUOSkg9bJO', 'Akila', 'Nimantha', 'akila_nimantha'),
(8, 'Paliyakotuwa/ Hettipola', 'tharindupradeep1@gmail.com', '$2a$10$s9Ed.Tafuey3WNsS9PrnRuwaOMx/fT4Km8CUyrgllemzf6IP7FwWm', 'Tharindu', 'Rathnayake', 'tharibbdfzn'),
(9, 'Kandy', 'chiran@gmail.com', '$2a$10$kn1Y7I0H5aEaf7fHqhQgse78UChTZHD9n47BNDGiphw/G1vO4X6CC', 'Chiran', 'Dharshana', 'Chiran'),
(10, 'Paliyakotuwa', 'akilanimantha@gmail.com', '$2a$10$iIPgKz5vXYFplZ1ZNLj.vOnVfdBG2bahFYgE7tvph/3FavVTfHNw2', 'Akila', 'Nimantha', 'akila');

-- --------------------------------------------------------

--
-- Table structure for table `orderdetails`
--

CREATE TABLE `orderdetails` (
  `PID` int(11) NOT NULL,
  `OrderID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Size` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `Colour` varchar(15) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `orderdetails`
--

INSERT INTO `orderdetails` (`PID`, `OrderID`, `Quantity`, `Size`, `Colour`) VALUES
(1, 7, 2, 'xl', 'pink'),
(1, 8, 2, 'xl', 'black'),
(1, 9, 3, 's', 'white'),
(1, 10, 3, 'xxl', 'red'),
(1, 11, 4, 'xl', 'pink'),
(1, 12, 3, 'xxl', 'white'),
(1, 15, 2, 'xl', 'black'),
(1, 16, 2, 'xxl', 'white'),
(1, 18, 2, 'xl', 'black'),
(1, 19, 1, 'xl', 'black'),
(1, 21, 1, '15.5\'\'', 'Black'),
(1, 28, 1, 'L', 'Yellow'),
(1, 32, 1, '15.5\'\'', 'Black'),
(1, 34, 1, '16\'\'', 'Black'),
(1, 36, 1, '16\'\'', 'Black'),
(1, 40, 1, '15.5\'\'', 'Yellow'),
(1, 43, 1, 'L', 'Black'),
(1, 44, 1, '15.5\'\'', 'Yellow'),
(1, 46, 1, 'L', 'Black'),
(1, 48, 1, 'L', 'Black'),
(2, 20, 1, 'xl', 'white'),
(2, 24, 1, '32', 'Blue'),
(2, 27, 1, '28', 'Brown'),
(2, 30, 1, '34', 'Black'),
(17, 17, 1, 'xl', 'black'),
(20, 24, 1, '16\'\'', 'Yellow'),
(20, 26, 1, '15.5\'\'', 'Black'),
(20, 30, 3, 'L', 'Purple'),
(20, 33, 1, 'L', 'Yellow'),
(20, 37, 1, '15.5\'\'', 'Black'),
(20, 41, 5, 'L', 'Black'),
(20, 51, 5, 'L', 'Black'),
(21, 22, 1, '34', 'Blue'),
(21, 28, 3, '32', 'Black'),
(22, 23, 1, '32', 'Black'),
(22, 35, 1, '32', 'Black'),
(22, 50, 1, '34', 'Blue'),
(23, 38, 1, 'L', 'Black'),
(24, 39, 1, '26', 'Pink'),
(24, 42, 1, '26', 'Pink'),
(24, 47, 1, '26', 'Pink'),
(24, 49, 1, '26', 'Pink'),
(28, 45, 1, '26', 'Pink');

-- --------------------------------------------------------

--
-- Table structure for table `ordershipping`
--

CREATE TABLE `ordershipping` (
  `OrderID` int(11) NOT NULL,
  `CID` int(11) NOT NULL,
  `ShippingID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `ordershipping`
--

INSERT INTO `ordershipping` (`OrderID`, `CID`, `ShippingID`) VALUES
(2, 1, 2),
(11, 1, 1),
(12, 1, 2),
(15, 1, 1),
(16, 1, 1),
(17, 1, 2),
(18, 1, 2),
(19, 1, 2),
(20, 1, 1),
(21, 1, 1),
(22, 1, 1),
(23, 1, 1),
(24, 1, 1),
(26, 2, 1),
(27, 2, 1),
(28, 1, 1),
(30, 2, 1),
(32, 2, 1),
(33, 2, 1),
(34, 2, 1),
(35, 2, 1),
(36, 2, 1),
(37, 2, 1),
(38, 2, 1),
(39, 1, 1),
(40, 1, 1),
(41, 10, 1),
(42, 10, 1),
(43, 10, 1),
(44, 10, 1),
(45, 10, 1),
(46, 1, 1),
(47, 1, 1),
(48, 1, 1),
(49, 1, 1),
(50, 1, 1),
(51, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `ordert`
--

CREATE TABLE `ordert` (
  `OrderID` int(11) NOT NULL,
  `BillID` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `DeliveryDate` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `BillingDate` varchar(15) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `ordert`
--

INSERT INTO `ordert` (`OrderID`, `BillID`, `DeliveryDate`, `BillingDate`) VALUES
(1, '456', '2017-12-05', '2017-11-06'),
(2, NULL, '2018-01-11', '2017-12-11'),
(3, NULL, '2018-01-11', '2017-12-11'),
(4, '2017-12-11-00:56:35-451156', '2018-01-11', '2017-12-11'),
(5, '2017-12-11-01:19:14-301542', '2018-01-11', '2017-12-11'),
(6, '2017-12-11-01:21:27-281631', '2018-01-11', '2017-12-11'),
(7, '2017-12-11-01:23:29-159725', '2018-01-11', '2017-12-11'),
(8, '2017-12-11-15:31:07-806810', '2018-01-11', '2017-12-11'),
(9, '2017-12-11-15:42:01-981205', '2018-01-11', '2017-12-11'),
(10, '2017-12-11-15:47:40-153531', '2018-01-11', '2017-12-11'),
(11, '2017-12-11-15:50:10-156460', '2018-01-11', '2017-12-11'),
(12, '2017-12-11-17:39:09-520169', '2018-01-11', '2017-12-11'),
(13, '2017-12-11-17:39:09-520169', '2018-01-11', '2017-12-11'),
(14, '2017-12-11-17:39:09-520169', '2018-01-11', '2017-12-11'),
(15, '2017-12-11-17:52:10-912441', '2018-01-11', '2017-12-11'),
(16, '2017-12-11-19:01:20-536591', '2018-01-11', '2017-12-11'),
(17, '2017-12-13-14:50:31-883968', '2018-01-13', '2017-12-13'),
(18, '2017-12-15-19:42:28-990822', '2018-01-15', '2017-12-15'),
(19, '2017-12-16-05:05:26-209102', '2018-01-16', '2017-12-16'),
(20, '2017-12-17-01:03:58-332646', '2018-1-17', '2017-12-17'),
(21, '2017-12-17-16:50:19-222484', '2018-1-17', '2017-12-17'),
(22, '2017-12-17-18:54:24-981820', '2018-1-17', '2017-12-17'),
(23, '2017-12-17-19:00:05-704787', '2018-1-17', '2017-12-17'),
(24, '2017-12-17-19:02:35-768765', '2018-1-17', '2017-12-17'),
(25, '2017-12-17-19:02:35-768765', '2018-1-17', '2017-12-17'),
(26, '2017-12-17-20:33:26-546179', '2018-1-17', '2017-12-17'),
(27, '2017-12-17-20:43:37-224609', '2018-1-17', '2017-12-17'),
(28, '2017-12-17-20:46:57-506385', '2018-1-17', '2017-12-17'),
(29, '2017-12-17-20:46:57-506385', '2018-1-17', '2017-12-17'),
(30, '2017-12-17-20:55:28-542585', '2018-1-17', '2017-12-17'),
(31, '2017-12-17-20:55:28-542585', '2018-1-17', '2017-12-17'),
(32, '2017-12-17-21:06:18-993238', '2018-1-17', '2017-12-17'),
(33, '2017-12-17-21:10:35-881458', '2018-1-17', '2017-12-17'),
(34, '2017-12-17-21:17:37-238608', '2018-1-17', '2017-12-17'),
(35, '2017-12-17-21:25:16-119561', '2018-1-17', '2017-12-17'),
(36, '2017-12-17-21:34:52-434790', '2018-1-17', '2017-12-17'),
(37, '2017-12-17-21:38:19-619871', '2018-1-17', '2017-12-17'),
(38, '2017-12-17-21:40:28-642145', '2018-1-17', '2017-12-17'),
(39, '2017-12-17-20:08:11-549058', '2018-1-17', '2017-12-17'),
(40, '2017-12-18-14:47:36-772069', '2018-1-18', '2017-12-18'),
(41, '2017-12-18-15:34:37-239087', '2018-1-18', '2017-12-18'),
(42, '2017-12-18-15:35:28-155960', '2018-1-18', '2017-12-18'),
(43, '2017-12-18-15:45:16-338613', '2018-1-18', '2017-12-18'),
(44, '2017-12-18-15:49:18-283032', '2018-1-18', '2017-12-18'),
(45, '2017-12-18-15:55:32-179893', '2018-1-18', '2017-12-18'),
(46, '2017-12-18-16:10:21-192816', '2018-1-18', '2017-12-18'),
(47, '2017-12-18-16:17:38-763510', '2018-1-18', '2017-12-18'),
(48, '2017-12-18-16:20:54-632683', '2018-1-18', '2017-12-18'),
(49, '2017-12-18-16:26:30-150947', '2018-1-18', '2017-12-18'),
(50, '2017-12-18-16:29:01-207020', '2018-1-18', '2017-12-18'),
(51, '2017-12-18-17:35:55-317582', '2018-1-18', '2017-12-18');

-- --------------------------------------------------------

--
-- Table structure for table `product_1`
--

CREATE TABLE `product_1` (
  `PID` int(11) NOT NULL,
  `MPrice` double NOT NULL,
  `StockAmnt` int(11) NOT NULL,
  `PName` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `Description` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `ProductImage` varchar(80) COLLATE utf8_unicode_ci DEFAULT NULL,
  `reorderLevel` int(11) NOT NULL,
  `Brand` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `category` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `Size` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `Colour` varchar(15) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `product_1`
--

INSERT INTO `product_1` (`PID`, `MPrice`, `StockAmnt`, `PName`, `Description`, `ProductImage`, `reorderLevel`, `Brand`, `category`, `Size`, `Colour`) VALUES
(1, 1250, 181, 'Shirt', 'Good quality', '/assets/img/shirt.jpg', 80, '', 'Tshirt', '15.5\'\'', 'Yellow'),
(20, 2500, 30, 'Tshirt', 'Good quality ', NULL, 50, 'Emarald', 'Tshirt', 'L', 'Black'),
(22, 2200, 54, 'Formal Trouser', 'Good quality ', NULL, 50, 'Emarald', 'Trouser', '34', 'Blue'),
(24, 1200, 196, 'Skirt', 'Good quality', NULL, 50, 'Brandix', 'Skirt', '26', 'Pink'),
(28, 1800, 149, 'Indian Frock', 'Good quality ', NULL, 30, 'Imported', 'Frock', '26', 'Pink');

-- --------------------------------------------------------

--
-- Table structure for table `product_2`
--

CREATE TABLE `product_2` (
  `PID` int(11) NOT NULL,
  `AdminID` int(11) NOT NULL,
  `CategoryID` int(11) DEFAULT NULL,
  `VID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `product_2`
--

INSERT INTO `product_2` (`PID`, `AdminID`, `CategoryID`, `VID`) VALUES
(1, 1, NULL, NULL),
(2, 1, NULL, NULL),
(3, 1, 3, NULL),
(4, 1, 6, NULL),
(5, 1, 8, NULL),
(6, 1, 9, NULL),
(7, 1, 5, NULL),
(8, 1, 1, NULL),
(9, 1, 2, NULL),
(10, 1, 10, NULL),
(11, 1, 3, NULL),
(12, 1, 3, NULL),
(13, 1, 10, NULL),
(14, 1, 6, NULL),
(15, 1, 10, NULL),
(16, 1, 3, NULL),
(17, 1, 1, NULL),
(18, 1, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `promohistory`
--

CREATE TABLE `promohistory` (
  `proID` int(11) NOT NULL,
  `promoCode` varchar(30) NOT NULL,
  `CID` int(11) NOT NULL,
  `promoAmount` int(11) NOT NULL,
  `promoRemain` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `promohistory`
--

INSERT INTO `promohistory` (`proID`, `promoCode`, `CID`, `promoAmount`, `promoRemain`) VALUES
(1, 'LFKX-0AD2-1V1K', 2, 1000, 0),
(5, '7UKW-8PLD-TA0M', 10, 1000, 0),
(6, '69PC-XDPJ-BMB3', 1, 1000, 0),
(7, '8DET-4KYP-3K7J', 1, 2500, 0),
(9, 'PE7V-U8YT-PJH6', 2, 2500, 1450),
(10, 'PE7V-U8YT-PJH6', 2, 1050, 0);

-- --------------------------------------------------------

--
-- Table structure for table `promotion`
--

CREATE TABLE `promotion` (
  `promotionID` int(11) NOT NULL,
  `promotionCode` varchar(40) NOT NULL,
  `CID` int(11) NOT NULL,
  `proAmnt` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `shipping`
--

CREATE TABLE `shipping` (
  `ShippingID` int(11) NOT NULL,
  `ShippingMethod` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `shippingCost` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `shipping`
--

INSERT INTO `shipping` (`ShippingID`, `ShippingMethod`, `shippingCost`) VALUES
(1, 'Normal', 200),
(2, 'Speed', 500);

-- --------------------------------------------------------

--
-- Table structure for table `vendor`
--

CREATE TABLE `vendor` (
  `VID` int(11) NOT NULL,
  `Company` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `Address` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `Email` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `Name` varchar(40) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `administrator`
--
ALTER TABLE `administrator`
  ADD PRIMARY KEY (`AdminID`);

--
-- Indexes for table `billinginfo`
--
ALTER TABLE `billinginfo`
  ADD PRIMARY KEY (`CreditCardNo`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`CartId`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`CID`);

--
-- Indexes for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`PID`,`OrderID`);

--
-- Indexes for table `ordershipping`
--
ALTER TABLE `ordershipping`
  ADD PRIMARY KEY (`OrderID`);

--
-- Indexes for table `ordert`
--
ALTER TABLE `ordert`
  ADD PRIMARY KEY (`OrderID`);

--
-- Indexes for table `product_1`
--
ALTER TABLE `product_1`
  ADD PRIMARY KEY (`PID`);

--
-- Indexes for table `product_2`
--
ALTER TABLE `product_2`
  ADD PRIMARY KEY (`PID`);

--
-- Indexes for table `promohistory`
--
ALTER TABLE `promohistory`
  ADD PRIMARY KEY (`proID`);

--
-- Indexes for table `promotion`
--
ALTER TABLE `promotion`
  ADD PRIMARY KEY (`promotionID`);

--
-- Indexes for table `shipping`
--
ALTER TABLE `shipping`
  ADD PRIMARY KEY (`ShippingID`);

--
-- Indexes for table `vendor`
--
ALTER TABLE `vendor`
  ADD PRIMARY KEY (`VID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `administrator`
--
ALTER TABLE `administrator`
  MODIFY `AdminID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `CartId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `CID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `ordert`
--
ALTER TABLE `ordert`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;
--
-- AUTO_INCREMENT for table `product_1`
--
ALTER TABLE `product_1`
  MODIFY `PID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `product_2`
--
ALTER TABLE `product_2`
  MODIFY `PID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `promohistory`
--
ALTER TABLE `promohistory`
  MODIFY `proID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `promotion`
--
ALTER TABLE `promotion`
  MODIFY `promotionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `shipping`
--
ALTER TABLE `shipping`
  MODIFY `ShippingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `vendor`
--
ALTER TABLE `vendor`
  MODIFY `VID` int(11) NOT NULL AUTO_INCREMENT;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
