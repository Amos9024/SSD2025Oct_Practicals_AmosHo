CREATE TABLE Users (
    UserID     INT IDENTITY NOT NULL,
    Name       VARCHAR(50) NOT NULL,
    EmailAddr  VARCHAR(50) NOT NULL,
    Contact    CHAR(10) NULL,
    Role       VARCHAR(20) NULL,
    DateJoined DATE NOT NULL,
    PasswordHash VARCHAR(255) NULL,
    CONSTRAINT PK_Users PRIMARY KEY (UserID),
    CONSTRAINT CK_Users_Role CHECK (Role IN ('member', 'admin')),
    CONSTRAINT CK_Users_DateJoined CHECK (DateJoined <= GETDATE())
);