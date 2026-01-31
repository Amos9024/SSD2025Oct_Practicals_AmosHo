INSERT INTO Users (UserID, Name, EmailAddr, Contact, Status, DateJoined)
VALUES
(1, 'Alice Lee', 'alice.lee@email.com', '98745612', 'A', '2023-01-15'),
(2, 'Bob Lim', 'bob.lim@email.com', NULL, 'A', '2023-03-10'),
(3, 'Carol Ng', 'carol.ng@email.com', '89786541', 'A', '2022-11-05'),
(4, 'John Tan', 'john.tan@email.com', NULL, 'A', '2023-04-09');



INSERT INTO Bins (BinID, LocationID, CurrentCapacity, MaxCapacity, Country, BinStatus)
VALUES
(101, 'SG1', 30, 120, 'Singapore','A'),
(102, 'JP1', 75, 120, 'Japan','A'),
(103, 'HK1', 50, 100, 'HongKong', 'A'),
(104, 'HK2', 30, 100, 'HongKong', 'A');



INSERT INTO DisposalRequest 
(DisposalID, BinID, UserID, DateDisposed, SerialNumber, ModelName, Brand, Weight)
VALUES
(1001, 101, 1, '2026-01-05', 5501, 'HP EG0300FBDSP', 'HP',1),
(1002, 102, 2, '2026-01-12', 5502, 'HP MB1000GCEHH', 'HP',2),
(1003, 103, 3, '2026-01-20', 5003, 'Dell ST1000NM0033', 'Dell',2);