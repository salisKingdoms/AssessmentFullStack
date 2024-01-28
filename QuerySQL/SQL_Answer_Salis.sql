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
select top 1 case when ((SELECT LEN(Employee) - LEN(REPLACE(Employee, ' ', '')) + 1) >= 3) 
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
--EXEC search_customer_transaction @customerID ='CU001';
--13. Buatlah store procedure dengan nama check_month_sale 
--untuk melihat total transaksi yang dilakukan pada nama bulan tertentu (misalnya October)
CREATE PROCEDURE check_month_sale
    -- Add parameters if needed
      @month varchar (10)

AS
BEGIN
   select * from TrSaleHeader 
   where DATENAME(MONTH, lower(TransactionDate)) like'%'+@month+'%'
 
END;
--EXEC check_month_sale @month ='Oct';
--14.  Buatlah store procedure dengan nama find_transactionID 
--untuk memunculkan kode transaksi yang diinginkan berdasarkan customerid 
--atau employeeid yang diinput dan jika customerid atau employeeid tidak ditemukan, 
--maka sistem akan memunculkan "data not found"
--(gunakan dynamic query)
CREATE PROCEDURE find_transactionID
    @id NVARCHAR(50)
AS
BEGIN
    DECLARE @SqlQuery NVARCHAR(MAX);

	if(select count(TransactionID) from TrSaleHeader where CustomerID=@id or EmployeeID=@id) > 0
	begin
    SET @SqlQuery = '
        select TransactionID
        from TrSaleHeader
        where CustomerID = ' + QUOTENAME(@id, '''')+'or EmployeeID= '+ QUOTENAME(@id, '''');
	end
	else
	begin
	select 'data not found'
	return;
	end
    
    PRINT @SqlQuery;
	EXEC sp_executesql @SqlQuery;
END;
EXEC find_transactionID @id='EM090';

--15. Buatlah store procedure dengan nama find_employee untuk
--menampilkan nama employee yang melayani transaksi 
--berdasarkan transactionID yang diinput dan jika transactionid tidak ditemukan, 
--maka sistem akan memunculkan "data not found"
CREATE PROCEDURE find_employee
    @id NVARCHAR(50)
AS
BEGIN
    DECLARE @SqlQuery NVARCHAR(MAX);

	if(select count(b.Name ) from TrSaleHeader a join MsEmployee b on a.EmployeeID = b.EmployeeID where a.TransactionID=@id) > 0
	begin
    SET @SqlQuery = '
        select b.Name 
        from TrSaleHeader a
		join MsEmployee b on a.EmployeeID = b.EmployeeID
        where a.TransactionID = ' + QUOTENAME(@id, '''');
	end
	else
	begin
	select 'data not found'
	return;
	end
    
    PRINT @SqlQuery;
	EXEC sp_executesql @SqlQuery;
END;

EXEC find_employee @id='TR001';