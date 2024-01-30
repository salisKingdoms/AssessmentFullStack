USE [assessmentdb]
GO

/****** Object:  Table [dbo].[ms_employee]    Script Date: 1/30/2024 11:13:40 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ms_employee](
	[ID] [bigint] NOT NULL,
	[name] [varchar](30) NOT NULL,
	[birth_date] [date] NOT NULL,
	[address] [varchar](200) NULL,
	[sallary] [numeric](12, 4) NULL,
	[nik] [varchar](10) NULL,
	[entry_date] [date] NOT NULL,
	[update_date] [date] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


