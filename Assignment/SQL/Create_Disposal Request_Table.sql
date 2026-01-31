CREATE TABLE DisposalRequest (
	DisposalID	 smallint NOT NULL,
	BinID		 smallint NOT NULL,
	UserID		 smallint NOT NULL, 
	DateDisposed  DATE NOT NULL,
	SerialNumber smallint NOT NULL,
	ModelName    varchar(50) NOT NULL,
	Brand        varchar(50) NULL,
	Weight		 smallint NOT NULL,
	CONSTRAINT   PK_DisposalRequest PRIMARY KEY (DisposalID),
	CONSTRAINT   FK_DisposalRequest_Bin FOREIGN KEY (BinID) REFERENCES Bin(BinID),
	CONSTRAINT   FK_DisposalRequest_User FOREIGN KEY (UserID) REFERENCES Users(UserID),
);
