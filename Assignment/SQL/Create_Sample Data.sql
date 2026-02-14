INSERT INTO Users (Name, EmailAddr, Contact, Role, DateJoined)
VALUES
('Alice Lee', 'alice.lee@email.com', '98745612', NULL, '2023-01-15'),
('Bob Lim', 'bob.lim@email.com', NULL, NULL, '2023-03-10'),
('Carol Ng', 'carol.ng@email.com', '89786541', NULL, '2022-11-05'),
('John Tan', 'john.tan@email.com', NULL, NULL, '2023-04-09');



INSERT INTO Bins (LocationID, CurrentCapacity, MaxCapacity, Country, BinStatus)
VALUES
('SG1', 30, 120, 'Singapore','A'),
('JP1', 75, 120, 'Japan','A'),
('HK1', 50, 100, 'HongKong', 'A'),
('HK2', 30, 100, 'HongKong', 'A');



INSERT INTO DisposalRequest 
(BinID, UserID, DateDisposed, SerialNumber, ModelName, Brand, Weight, isDeleted)
VALUES
(101, 1, '2026-01-05', 5501, 'HP EG0300FBDSP', 'HP',1,0),
(102, 2, '2026-01-12', 5502, 'HP MB1000GCEHH', 'HP',2,0),
(103, 3, '2026-01-20', 5003, 'Dell ST1000NM0033', 'Dell',2, 0);