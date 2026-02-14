CREATE TABLE DisposalRequest (
	DisposalID	 INT IDENTITY(1001,1) NOT NULL,
	BinID		 INT NOT NULL,
	UserID		 INT NOT NULL, 
	DateDisposed  DATE NOT NULL,
	SerialNumber smallint NOT NULL,
	ModelName    varchar(50) NOT NULL,
	Brand        varchar(50) NULL,
	Weight		 smallint NOT NULL,
	isDeleted	 INT NOT NULL,
	CONSTRAINT   PK_DisposalRequest PRIMARY KEY (DisposalID),
	CONSTRAINT   FK_DisposalRequest_Bin FOREIGN KEY (BinID) REFERENCES Bins(BinID),
	CONSTRAINT   FK_DisposalRequest_User FOREIGN KEY (UserID) REFERENCES Users(UserID),
);
