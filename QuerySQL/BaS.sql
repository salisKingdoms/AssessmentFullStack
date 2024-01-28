--create database BaS
use BaS

IF OBJECT_ID('dbo.MsCustomer', 'U') IS NOT NULL
    DROP TABLE dbo.MsCustomer;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'MsCustomer')
BEGIN
CREATE TABLE MsCustomer
(
   CustomerID char(5),
Name varchar(100),
Gender varchar(10),
Address varchar(100),
Phone varchar(15)

);END;

IF OBJECT_ID('dbo.MsEmployee', 'U') IS NOT NULL
    DROP TABLE dbo.MsEmployee;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'MsEmployee')
BEGIN
Create table MsEmployee
(
EmployeeID char(5),
Name varchar(100),
Salary int,
BranchID char(5)
);END;

IF OBJECT_ID('dbo.MsBranch', 'U') IS NOT NULL
    DROP TABLE dbo.MsBranch;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'MsBranch')
BEGIN
Create table MsBranch
(
BranchID char(5),
Name varchar(100),
City varchar(50)
)END;

IF OBJECT_ID('dbo.MSProduct', 'U') IS NOT NULL
    DROP TABLE dbo.MSProduct;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'MSProduct')
BEGIN
Create table MSProduct
(
ProductID varchar(3),
Name varchar(100),
Stock int,
Price int
)END;

IF OBJECT_ID('dbo.TrSaleHeader', 'U') IS NOT NULL
    DROP TABLE dbo.TrSaleHeader;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'TrSaleHeader')
BEGIN
Create table TrSaleHeader
(
TransactionID varchar(5),
EmployeeID varchar(5),
CustomerID varchar(5),
TransactionDate datetime
)END;

IF OBJECT_ID('dbo.TrSaleDetail', 'U') IS NOT NULL
    DROP TABLE dbo.TrSaleDetail;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'TrSaleDetail')
BEGIN
Create table TrSaleDetail
(
TransactionID varchar(5),
ProductID varchar(3),
Qty int
)END;

insert into MsCustomer(CustomerID, Name, Gender, Address, Phone) values 
('CU001','Leon Sweeney','Male','Jl. K.H Syahdan no.9','081122334455'),
('CU002','Albert Stewart','Male','Jl. Budi Kemuliaan no.21','081122333333'),
('CU003','Angelia Jackline','Female','Jl. Batu Sari Raya no.17','081122334477'),
('CU004','Vania','Female','Jl. Panjang no.123','081133115522'),
('CU005','Leafy Doofey','Female','Jl. Merdeka no.12','081133115123'),
('CU006','Bruno Andersen','Female','Jl. Ubut Bali no.11','081133110022'),
 ('CU007','Jeffry Clinton Alexes','Female','Jl. Lembang Kembang no.142','081112345522')

 insert into MsEmployee(EmployeeID, Name, Salary, BranchID) values 
 ('EM001','John Mayer','10000000','BR001'),
('EM002','Jessica Brune','8500000','BR002'),
('EM003','Victoria Angel','9000000','BR002'),
('EM004','Kevin Deune','11000000','BR003'),
('EM005','Alex John Freeday','9500000','BR001'),
('EM006','Shawn Leek','10500000','BR003')

insert into MsBranch(BranchID, Name, City) values 
('BR001','Buy and Shine 1','Jakarta'),
('BR002','Buy and Shine 2','Bandung'),
('BR003','Buy and Shine 3','Denpasar')

insert into MSProduct(ProductID, Name, Stock, Price) values
('P01','Razer BlackWidow',12,1500000),
('P02','Razer Mamba',10,1200000),
('P03','Steelseries Siberia',5,2000000),
('P04','Steelseries Sensei',7,1000000),
('P05','Ducky Shine',15,1250000),
('P06','Cherry MX-Blue',15,2100000),
('P07','Razer Chroma',10,2300000),
('P08','Steelseries Rival',9,950000),
('P09','Corsair K70',19,1500000),
('P10','STRacing',20,2800000),
('P11','STRacing PRO',10,3000000)
insert into MSProduct(ProductID, Name, Stock, Price) values('P12','Steelseries QCK Mass',30,220000)

insert into TrSaleHeader(TransactionID, EmployeeID, CustomerID, TransactionDate) values
('TR001','EM001','CU002','2016-10-23'),
('TR002','EM002','CU001','2016-07-23'),
('TR003','EM002','CU001','2016-01-12'),
('TR004','EM001','CU003','2016-01-23'),
('TR005','EM003','CU004','2016-09-28'),
('TR006','EM004','CU006','2016-03-14'),
('TR007','EM004','CU002','2016-02-17'),
('TR008','EM005','CU007','2016-10-06'),
('TR009','EM006','CU007','2016-06-23')

insert into TrSaleDetail(TransactionID, ProductID, Qty) 
values('TR001','P09',1),
('TR001','P01',2),
('TR002','P10',1),
('TR002','P11',2),
('TR002','P12',3),
('TR003','P01',1),
('TR004','P07',3),
('TR004','P05',3),
('TR005','P05',2),
('TR005','P08',1),
('TR006','P12',3),
('TR007','P12',6),
('TR008','P02',1),
('TR008','P03',2),
('TR008','P01',1),
('TR009','P05',2),
('TR009','P09',6)

select * from MsCustomer
select * from MsEmployee
select * from MsBranch
select * from MsProduct
select * from TrSaleHeader
select * from TrSaleDetail

--1. Tampilkan top 2 EmployeeID, EmployeeName dimana BranchID nya adalah 'BR002' (top, like)
select top 2 EmployeeID, Name from MsEmployee
where BranchID like '%BR002%'
--2. Tampilkan nama employee yang memiliki salary antara 10000000 hingga 12000000 (between)
select Name from MsEmployee where Salary between 10000000 and 12000000
--3. Buatkan view dengan nama view 'view_emp_branch' untuk melihat nama employee dan branch name nya
CREATE VIEW view_emp_branch AS
SELECT a.Name as Employee, b.Name as BranchName
FROM MsEmployee a
JOIN MsBranch b on a.BranchID = b.BranchID
;
select * from view_emp_branch
--4.Tampilkan BranchEmployee ( didapat dari employeename dan nama depan employeename diganti dengan branchID ) dimana employeename memiliki minimal 3 kata. (like)
select top 1 case when ((SELECT LEN(Employee) - LEN(REPLACE(Employee, ' ', '')) + 1) = 3) 
then BranchName+Employee end as BranchEmployee from view_emp_branch 
order by BranchName,Employee asc
--5. Tampilkan ProductName (didapat dari kata pertama ProductName), Price (didapat dari price ditambahkan kata 'Rp. ' didepannya), Stock dan product name mengandung kata 'Razer'
SELECT
    SUBSTRING(Name, 1, CHARINDEX(' ', Name + ' ') - 1) AS ProductName,
    'Rp. ' + CAST(Price AS VARCHAR) AS Price
FROM MsProduct
WHERE Name LIKE '%Razer%';
--6.  Tampilkan EmployeeName yang melayani Customer pada Branch Buy and Shine 1 (BR001) (convert, join, like, order by)
select a.Name as EmployeeName,d.Name as Customer from MsEmployee a
 join TrSaleHeader b on a.EmployeeID = b.EmployeeID
join MsBranch c on a.BranchID = c.BranchID and c.BranchID like '%BR001%'
join MsCustomer d on b.CustomerID = d.CustomerID
order by a.Name desc

--7.   Tampilkan Employee Name yang melayani transaksi pada bulan Oktober dan 
--tampilkan tanggal transaksi dengan format dd mm yyyy (convert, join, month)
--CONVERT(VARCHAR(12), @OriginalDate, 106) AS FormattedDate
select a.Name , CONVERT(VARCHAR(12), b.TransactionDate, 106) AS Date from MsEmployee a
join TrSaleHeader b on a.EmployeeID = b.EmployeeID
where DATENAME(MONTH, b.TransactionDate) like'%oct%'
--8. Tampilkan BranchName,EmployeeName, Qty dimana transaksi terjadi antara bulan Juni 
--hingga Oktober dan Qty lebih dari sama dengan 2. (join, MONTH, between)
select d.Name as BranchName,c.Name as EmployeeName,b.Qty 
from TrSaleHeader a
join TrSaleDetail b on a.TransactionID = b.TransactionID
join MsEmployee c on a.EmployeeID = c.EmployeeID
join MsBranch d on c.BranchID = d.BranchID
where (DATENAME(MONTH, a.TransactionDate) between 'June' and 'October')
and b.Qty >=2
--9. Buatlah store procedure dengan nama detail_transaction yang 
--berfungsi untuk memunculkan nama customer dan jumlah harga pada transactionid yang dicari 
--(create procedure, SUM, group by) detail_transaction'TR001'
CREATE PROCEDURE detail_transaction
    -- Add parameters if needed
      @transactionid varchar (10)
    --@Parameter2 VARCHAR(50)
AS
BEGIN
   
    SELECT a.Name,sum(d.Price * c.Qty) as TotalPrice
    FROM MsCustomer a
	 join TrSaleHeader b on a.CustomerID = b.CustomerID
	 join TrSaleDetail c on b.TransactionID = c.TransactionID
	 join MSProduct d on c.ProductID = d.ProductID
     WHERE b.TransactionID =@transactionid
	 group by a.Name;
END;
EXEC detail_transaction @transactionid ='TR001';
--10.Tampilkan nama customer dan jumlah transaksi yang dilakukan oleh masing-masing customer
--(COUNT, join, GROUP by)
SELECT b.Name, count(a.TransactionID) as TotalTransaksi
    FROM TrSaleHeader a
	join MsCustomer b on a.CustomerID = b.CustomerID
	group by b.Name 

--11. Buatlah Store Procedure untuk melakukan penambahan product dengan nama add_product, dimana
--Stok pada MSProduct akan bertambah sesuai jumlah yang di input.
--Jika kode ProductID yang dimasukan tidak ada pada database, maka sistem akan mengeluarkan pesan "data not found" 
--add_product'P01','12'
CREATE PROCEDURE add_product
    -- Add parameters if needed
      @ProductID varchar (10),
	  @qty varchar(3)

AS
BEGIN
   IF (select count(ProductID) from MSProduct where ProductID = @ProductID)>0
   begin
     update MSProduct set Stock=Stock+@qty where  ProductID = @ProductID
      select * from MSProduct where  ProductID = @ProductID
   end
   else
   begin
   select 'data not found'
		return
   end
 
END;
--EXEC add_product @ProductID ='P13',@qty=3;
--12. Buatlah store procedure dengan nama search_customer_transaction 
--untuk melihat product apa saja dan berapa jumlah yang dibeli oleh customer 
--dengan cara memasukan customerID
CREATE PROCEDURE search_customer_transaction
    -- Add parameters if needed
      @customerID varchar (100)

AS
BEGIN
   SELECT b.Name,d.Name, sum(c.Qty) as Qty
    FROM TrSaleHeader a
	join MsCustomer b on a.CustomerID = b.CustomerID
	join TrSaleDetail c on a.TransactionID = c.TransactionID
	join MSProduct d on c.ProductID = d.ProductID
	where b.CustomerID=@customerID
	group by b.Name,d.Name
 
END;
EXEC search_customer_transaction @customerID ='CU001';

