const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all users
async function getAllUsers() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT UserID, Name, EmailAddr FROM Users";
    const result = await connection.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Get user by ID
async function getUserById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT * FROM Users WHERE UserID = @id";
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null; // User not found
    }

    return result.recordset[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Get user by name
async function getUserByUsername(username) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT * FROM Users WHERE Name = @Name";
    const request = connection.request();
    request.input("Name", username);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null; // User not found
    }

    return result.recordset[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}


// Create new user
async function createUser(userData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "INSERT INTO Users (Name, EmailAddr, Contact, Status, DateJoined, PasswordHash) VALUES (@Name, @EmailAddr, @Contact, @Status, @DateJoined, @PasswordHash); SELECT SCOPE_IDENTITY() AS id;";
    const request = connection.request();
    request.input("Name", userData.Name);
    request.input("EmailAddr", userData.EmailAddr);
    request.input("Contact", userData.Contact);
    request.input("Status", userData.Status);
    request.input("DateJoined", userData.DateJoined);
    request.input("PasswordHash", userData.PasswordHash);
    const result = await request.query(query);

    const newUserId = result.recordset[0].id;
    return await getUserById(newUserId);
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Update an existing user
async function updateUser(id, userData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "UPDATE Users SET Name = @Name, EmailAddr = @EmailAddr, Contact = @Contact, Status = @Status WHERE UserID = @UserID;"; // Name is SQL column name, @Name is parameter, Map from right to left
    const request = connection.request();
    request.input("Name", userData.Name);
    request.input("EmailAddr", userData.EmailAddr);
    request.input("Contact", userData.Contact);
    request.input("Status", userData.Status);
    request.input("UserID", id);
    const result = await request.query(query);
    return result.rowsAffected[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Delete an existing user
async function deleteUser(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "DELETE FROM Users WHERE UserID = @UserID";
    const request = connection.request();
    request.input("UserID", id);
    const result = await request.query(query);
    return result.rowsAffected[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

async function searchUsers(searchTerm) {
  let connection; // Declare connection outside try for finally access
  try {
    connection = await sql.connect(dbConfig);

    // Use parameterized query to prevent SQL injection
    const query = `SELECT * FROM Users WHERE username LIKE '%' + @searchTerm + '%'`;

    const request = connection.request();
    request.input("searchTerm", sql.NVarChar, searchTerm); // Explicitly define type
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database error in searchUsers:", error); // More specific error logging
    throw error; // Re-throw the error for the controller to handle
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection after searchUsers:", err);
      }
    }
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
};