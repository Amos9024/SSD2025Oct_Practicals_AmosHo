CREATE TABLE Users (
    UserID     INT IDENTITY NOT NULL,
    Name       VARCHAR(50) NOT NULL,
    EmailAddr  VARCHAR(50) NOT NULL,
    Contact    CHAR(10) NULL,
    Status     CHAR(1) NOT NULL,
    DateJoined DATE NOT NULL,
    PasswordHash VARCHAR(255) NULL,
    CONSTRAINT PK_Users PRIMARY KEY (UserID),
    CONSTRAINT CK_Users_Status CHECK (Status IN ('A', 'N')),
    CONSTRAINT CK_Users_DateJoined CHECK (DateJoined <= GETDATE())
);