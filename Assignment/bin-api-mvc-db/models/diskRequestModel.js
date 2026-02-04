const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all requests
async function getAllRequests() {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = "SELECT DisposalID, BinID, UserID, DateDisposed, SerialNumber, ModelName, Brand, Weight FROM DisposalRequest";
        const result = await connection.request().query(query);
        return result.recordset;
    }catch (error) {
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

async function getRequestById(id) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = "SELECT DisposalID, BinID, UserID, DateDisposed, SerialNumber, ModelName, Brand, Weight FROM DisposalRequest WHERE DisposalID = @id";
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return null; // Request not found
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

// Create new request
async function createRequest(requestData) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = "INSERT INTO DisposalRequest (BinID, UserID, DateDisposed, SerialNumber, ModelName, Brand, Weight) VALUES (@binId, @userId, @dateDisposed, @serialNumber, @modelName, @brand, @weight); SELECT SCOPE_IDENTITY() AS DisposalID;";
        const request = connection.request();
        request.input("BinID", requestData.BinID);          
        request.input("UserID", requestData.UserID);
        request.input("DateDisposed", requestData.DateDisposed);
        request.input("SerialNumber", requestData.SerialNumber);
        request.input("ModelName", requestData.ModelName);
        request.input("Brand", requestData.Brand);
        request.input("Weight", requestData.Weight);
        const result = await request.query(query);

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

// Update an existing request
async function updateRequest(id, requestData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "UPDATE DisposalRequest SET BinID = @binId, UserID = @userId, DateDisposed = @dateDisposed, SerialNumber = @serialNumber, ModelName = @modelName, Brand = @brand, Weight = @weight WHERE DisposalID = @id; SELECT * FROM DisposalRequest WHERE DisposalID = @id;";
    const request = connection.request();
    request.input("id", id);
    request.input("binId", requestData.BinID);
    request.input("userId", requestData.UserID);
    request.input("dateDisposed", requestData.DateDisposed);
    request.input("serialNumber", requestData.SerialNumber);
    request.input("modelName", requestData.ModelName);
    request.input("brand", requestData.Brand);
    request.input("weight", requestData.Weight);
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

// delete an existing request
async function deleteRequest(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "DELETE FROM DisposalRequest WHERE DisposalID = @id;";
    const request = connection.request();
    request.input("id", id);
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

// in JavaScript, in order to access the functions we have to export them. 
module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest
}