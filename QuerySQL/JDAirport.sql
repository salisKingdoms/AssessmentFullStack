--JDAirport

IF OBJECT_ID('dbo.msRole', 'U') IS NOT NULL
    DROP TABLE dbo.msRole;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'msRole')
BEGIN
CREATE TABLE msRole
(
   IDRole INT PRIMARY KEY IDENTITY(1,1),
	RoleName VARCHAR(25)

);END;

IF OBJECT_ID('dbo.msPlane', 'U') IS NOT NULL
    DROP TABLE dbo.msPlane;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'msPlane')
BEGIN
CREATE TABLE msPlane
(
   IDPlane VARCHAR(6) PRIMARY KEY,	
	Capacity INT NOT NULL
);END;

IF OBJECT_ID('dbo.trSchedule', 'U') IS NOT NULL
    DROP TABLE dbo.trSchedule;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'trSchedule')
BEGIN
CREATE TABLE trSchedule
(
   IDSchedule VARCHAR(6) PRIMARY KEY, 
	IDPlane VARCHAR(6) FOREIGN KEY REFERENCES msPlane(IDPlane),	
	Origin VARCHAR(30),
	Destination VARCHAR(30),
	FlightTime VARCHAR(15),
	FlightDate DATE
);END;

IF OBJECT_ID('dbo.trCrew', 'U') IS NOT NULL
    DROP TABLE dbo.trCrew;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'trCrew')
BEGIN
CREATE TABLE trCrew
(
   IDCrew INT PRIMARY KEY IDENTITY(1,1),	
	IDRole INT FOREIGN KEY REFERENCES msRole(IDRole),	
	IDSchedule VARCHAR(6) FOREIGN KEY REFERENCES trSchedule(IDSchedule),
	Name VARCHAR(50) NOT NULL,
	Gender CHAR NOT NULL,
	CONSTRAINT checkGender2 CHECK (Gender in ('M','F'))
);END;

IF OBJECT_ID('dbo.trPassenger', 'U') IS NOT NULL
    DROP TABLE dbo.trPassenger;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'trPassenger')
BEGIN
CREATE TABLE trPassenger
(
   IDPassenger INT PRIMARY KEY IDENTITY(1,1),
	IDSchedule VARCHAR(6) FOREIGN KEY REFERENCES trSchedule(IDSchedule),
	Name VARCHAR(50) NOT NULL,
	Seat VARCHAR(3) NOT NULL,
	Gender CHAR NOT NULL,
	Age INT NOT NULL,
	CONSTRAINT checkGender CHECK (Gender in('M','F')),
	CONSTRAINT checkName CHECK (Name like '% %')
);END;

IF OBJECT_ID('dbo.trLuggage', 'U') IS NOT NULL
    DROP TABLE dbo.trLuggage;
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'trLuggage')
BEGIN
CREATE TABLE trLuggage
(
   IDLuggage INT PRIMARY KEY IDENTITY(1,1),
	IDPassenger INT FOREIGN KEY REFERENCES trPassenger(IDPassenger),
	Weight INT,
	CONSTRAINT checkWeight CHECK (Weight >=0 AND Weight <=50)
);END;

INSERT INTO msRole(RoleName)
VALUES
('Pilot'),
('Co-Pilot'),
('Stewardess')

INSERT INTO msPlane(IDPlane,Capacity)
VALUES
('LA347',8),
('GI456',7),
('BA894',10),
('AS843',5),
('OP127',10),
('IU674',9),
('QE943',5),
('EY637',5),
('GH334',5),
('ER923',5)

INSERT INTO trSchedule(IDSchedule, Origin, Destination, FlightTime, FlightDate, IDPlane)
VALUES
('FLG843','Palembang','Jakarta','16.00 - 17.10', '2018-08-30','BA894'),
('FLG192','Jakarta','Palembang','10.30 - 11.40', '2018-11-11','GI456'),
('FLG228','Jakarta','Bali','16.00 - 17.10', '2018-10-30','LA347'),
('FLG483','Medan','Padang','10.00 - 11.20','2018-06-20','LA347'),
('FLG593','Manado','Makasar','15.15 - 16.50','2018-08-23','GI456'),
('FLG603','Jakarta','Jerman','10.10 - 04.00','2018-11-02','LA347'),
('FLG710','Jerman','Jakarta','10.10 - 04.00','2018-11-02','QE943'),
('FLG937','Semarang','Yogyakarta','13.20 - 14.30','2018-11-29','LA347'),
('FLG109','Bandung','Makasar','18.30 - 19.50','2018-12-25','ER923'),
('FLG112','Pekanbaru','Pontianak','17.00 - 18.45','2018-05-1','GH334')

select * from trschedule order by flightdate desc

INSERT INTO trCrew(IDRole, IDSchedule, Name, Gender)
VALUES
(1,'FLG843','Bryan','M'),
(1,'FLG192','Tony','M'),
(1,'FLG228','Charlie','M'),
(1,'FLG483','Dane','M'),
(1,'FLG593','Edward','M'),
(1,'FLG603','Franz','M'),
(1,'FLG710','Gideon','M'),
(1,'FLG937','Harry','M'),
(1,'FLG109','Jonathan','M'),
(1,'FLG112','Kristopher','M'),
(2,'FLG112','Vredy','M'),
(2,'FLG843','Wendy','M'),
(2,'FLG192','Xavier','M'),
(2,'FLG228','Yohanes','M'),
(2,'FLG483','Timothy','M'),
(2,'FLG593','Sebastian','M'),
(2,'FLG603','Pedro','M'),
(2,'FLG710','Roosevelt','M'),
(2,'FLG937','Steven','M'),
(2,'FLG109','Zavi','M'),
(3,'FLG109','Anna','F'),
(3,'FLG112','Belle','F'),
(3,'FLG843','Jeanie','F'),
(3,'FLG192','Kelly','F'),
(3,'FLG228','Linda','F'),
(3,'FLG483','Monica','F'),
(3,'FLG593','Naty','F'),
(3,'FLG603','Rene','F'),
(3,'FLG710','Caroline','F'),
(3,'FLG937','Odilia','F')

INSERT INTO trPassenger(IDSchedule,Name,Seat,Gender,Age)
VALUES
('FLG843','Shane Shane','1C','M',21),
('FLG843','Fernando Holmes','1B','M',20),
('FLG843','Caroline Lim','1A','F',20),
('FLG843','May McCallister','1E','F',22),
('FLG843','Pete Smith','2A','M',24),
-- DONE
('FLG192','Joshua Setiawan','1F','M',22),
('FLG192','Gracia Malkovich','2A','F',50),
('FLG192','Morwenna Barker','2B','F',12),
('FLG192','Gracia Vader','1D','F',34),
('FLG192','Harold Williams','1B','M',12),
-- DONE
('FLG228','Jessica Hendrawaty','2E','F',23),
('FLG228','Harold Pitt','2A','M',45),
('FLG228','Sonya Chandra','1E','F',23),
('FLG228','Dolly Nolan','2D','F',24),
('FLG228','Hannah Parker','1A','F',31),
-- DONE
('FLG483','Gary Blast','1B','M',23),
('FLG483','Mike Sparkle','2F','M',45),
('FLG483','Kate Torrance','2E','F',23),
('FLG483','Harriet Jones','1A','F',24),
('FLG483','Kimberly Giantbulb','1C','F',31),
-- DONE
('FLG593','Catherine Thornton','1A','F',34),
('FLG593','Harriet Rockatansky','2F','M',23),
('FLG593','Dolly Snozcumber','1D','F',12),
('FLG593','Steven Raymond','2A','M',22),
('FLG593','Charlotte Williams','2B','F',29),
-- DONE
('FLG603','Suki DeVito','1A','F',14),
('FLG603','Molly Nolan','2E','F',43),
('FLG603','Susan Malkovich','1B','F',13),
('FLG603','Rick Wishmonger','2F','M',52),
('FLG603','Chantal Randall','1E','M',19),
-- DONE
('FLG710','Wenna Parker','2F','F',34),
('FLG710','Rachel Cox','2A','F',15),
('FLG710','Raul Kowalski','1C','M',42),
('FLG710','Suzanne Noris','2C','F',12),
('FLG710','Rob Wishmonger','1E','M',34),
-- DONE
('FLG937','Michelle Ferguson','2E','F',32),
('FLG937','Graham Russell','1B','M',14),
('FLG937','Toby Parker','2A','M',34),
('FLG937','Josh Wilson','1F','M',65),
('FLG937','Marion Doop','1A','F',32),
-- DONE
('FLG109','Christian Khan','1A','M',34),
('FLG109','Steve Parkes','1C','M',23),
('FLG109','Brad Nolan','2E','M',12),
('FLG109','Sophia Superhalk','2F','F',43),
('FLG109','Harriet Wishmonger','2A','F',53),
-- DONE
('FLG112','Kevin Rockatansky','1C','M',31),
('FLG112','Phillip Thornton','1F','M',43),
('FLG112','Gemma Willis','2A','M',15),
('FLG112','Mike Kowalski','2B','M',54),
('FLG112','Sophia Sparkle','2C','F',12)

INSERT INTO trLuggage(IDPassenger, Weight)
VALUES
-- 1
(2, 10),
(4, 15),
-- 2
(6, 8),
(8, 4),
-- 3
(12, 9),
(11, 5),
-- 4
(19, 10),
(20, 10),
-- 5 
(21, 5),
-- 6
(30, 10)

select * from trschedule

select * from trCrew

select * from msRole

select * from trpassenger

select * from trluggage

select * from msplane




