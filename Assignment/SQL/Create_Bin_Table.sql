CREATE TABLE Bins (
    BinID           INT IDENTITY(101,1) NOT NULL,
    LocationID      VARCHAR(50) NOT NULL,
    CurrentCapacity SMALLINT NOT NULL,
    MaxCapacity     SMALLINT NOT NULL,
    Country         VARCHAR(50) NULL,
    BinStatus          CHAR(1) NOT NULL,
    CONSTRAINT PK_Bin PRIMARY KEY (BinID),
    CONSTRAINT CK_Bin_Status CHECK (BinStatus IN ('A', 'N')),
    CONSTRAINT CK_Bin_Capacity CHECK (CurrentCapacity <= MaxCapacity)
);