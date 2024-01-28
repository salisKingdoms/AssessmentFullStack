IF OBJECT_ID('dbo.ltcourierfee', 'U') IS NOT NULL
    DROP TABLE dbo.ltcourierfee;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'ltcourierfee')
BEGIN
CREATE TABLE ltcourierfee
(
   WeightID INT NOT NULL,
   CourierID VARCHAR(50) NOT NULL,
   StartKg VARCHAR(50) NOT NULL,
   EndKg VARCHAR(11)DEFAULT NULL,
   Price DECIMAL(10,0) DEFAULT NULL

);END;

INSERT INTO ltcourierfee (WeightID, CourierID, StartKg, EndKg, Price) VALUES
(1, 1, 1, 2, '8000'),
(2, 1, 3, 4, '9500'),
(3, 2, 1, 2, '7500'),
(4, 2, 3, 4, '8500'),
(5, 3, 1, 2, '10000'),
(6, 3, 3, 4, '10000'),
(7, 1, 5, 10, '10500'),
(8, 2, 5, 10, '9500'),
(9, 3, 5, 10, '12000');

IF OBJECT_ID('dbo.mscourier', 'U') IS NOT NULL
    DROP TABLE dbo.mscourier;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'mscourier')
BEGIN
    CREATE TABLE dbo.mscourier
    (
  CourierID VARCHAR(11)  PRIMARY KEY NOT NULL,
  CourierName varchar(50) NOT NULL
    );
END;

INSERT INTO mscourier (CourierID, CourierName) VALUES
(1, 'JNE'),
(2, 'J&T'),
(3, 'Wahana');

IF OBJECT_ID('dbo.mspayment', 'U') IS NOT NULL
    DROP TABLE dbo.mspayment;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'mspayment')
BEGIN
    CREATE TABLE dbo.mspayment
    (
	PaymentID varchar(11) PRIMARY KEY NOT NULL,
    PaymentName varchar(50) NOT NULL,
    );
END;

INSERT INTO mspayment (PaymentID, PaymentName) VALUES
(1, 'Cash'),
(2, 'COD');

IF OBJECT_ID('dbo.msproduct', 'U') IS NOT NULL
    DROP TABLE dbo.msproduct;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'msproduct')
BEGIN
    CREATE TABLE dbo.msproduct
    (
	ProductID varchar(11) PRIMARY KEY NOT NULL,
  ProductName varchar(50) NOT NULL,
  Weight float NOT NULL,
  Price decimal(10,0) NOT NULL
    );
END;

INSERT INTO msproduct (ProductID, ProductName, Weight, Price) VALUES
(1, 'Tepung', 1.5, '10000'),
(7, 'Bluband', 0.25, '8000'),
(9, 'Beras', 1, '64000'),
(10, 'Eskrim', 0.5, '20000'),
(11, 'Kentang', 1, '15000');
--mssales
IF OBJECT_ID('dbo.mssales', 'U') IS NOT NULL
    DROP TABLE dbo.mssales;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'mssales')
BEGIN
    CREATE TABLE dbo.mssales
    (
	 SalesID varchar(11) PRIMARY KEY NOT NULL,
     SalesName varchar(50) NOT NULL
    );
END;

INSERT INTO mssales (SalesID, SalesName) VALUES
(1, 'Andy'),
(2, 'Jessica');

IF OBJECT_ID('dbo.trinvoice', 'U') IS NOT NULL
    DROP TABLE dbo.trinvoice;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'trinvoice')
BEGIN
    CREATE TABLE dbo.trinvoice
    (
  InvoiceNo varchar(10)PRIMARY KEY NOT NULL,
  InvoiceDate datetime NOT NULL,
  InvoiceTo varchar(500) NOT NULL,
  ShipTo varchar(500) NOT NULL,
  SalesID varchar(11) NOT NULL,
  CourierID varchar(11) NOT NULL,
  PaymentType varchar(11) NOT NULL,
  CourierFee decimal(10,0) NOT NULL
    );
END;

INSERT INTO trinvoice (InvoiceNo, InvoiceDate, InvoiceTo, ShipTo, SalesID, CourierID, PaymentType, CourierFee) VALUES
('IN0001', '2015-06-23 00:00:00', 'Invoice Orang 1', 'Ship Orang 1', 1, 1, 1, '0'),
('IN0002', '2019-02-27 00:00:00', 'Invoice Orang 2', 'Ship Orang 2', 2, 2, 2, '0');

IF OBJECT_ID('dbo.trinvoicedetail', 'U') IS NOT NULL
    DROP TABLE dbo.trinvoicedetail;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'trinvoicedetail')
BEGIN
    CREATE TABLE dbo.trinvoicedetail
    (
  InvoiceNo varchar(10) NOT NULL,
  ProductID varchar(11) NOT NULL,
  Weight float NOT NULL,
  Qty SMALLINT NOT NULL,
  Price decimal(10,0) NOT NULL
    );
END;

INSERT INTO trinvoicedetail (InvoiceNo, ProductID, Weight, Qty, Price) VALUES
('IN0001', 1, 1.5, 3, '10000'),
('IN0001', 7, 0.25, 1, '8000'),
('IN0001', 9, 2, 3, '64000'),
('IN0002', 7, 0.25, 1, '8000'),
('IN0002', 10, 0.5, 3, '20000'),
('IN0002', 9, 2, 2, '64000');