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
        const insertQuery = "INSERT INTO DisposalRequest (BinID, UserID, DateDisposed, SerialNumber, ModelName, Brand, Weight) VALUES (@binId, @userId, @dateDisposed, @serialNumber, @modelName, @brand, @weight); SELECT SCOPE_IDENTITY() AS DisposalID;";
        const insertRequest = connection.request();
        insertRequest.input("BinID", requestData.BinID);          
        insertRequest.input("UserID", requestData.UserID);
        insertRequest.input("DateDisposed", requestData.DateDisposed);
        insertRequest.input("SerialNumber", requestData.SerialNumber);
        insertRequest.input("ModelName", requestData.ModelName);
        insertRequest.input("Brand", requestData.Brand);
        insertRequest.input("Weight", requestData.Weight);
        const insertResult = await insertRequest.query(insertQuery);

        const updateQuery = "UPDATE Bins SET currentCapacity = currentCapacity + @weight WHERE BinID = @id; SELECT * FROM Bins WHERE BinID = @id;";
        const updateRequest = connection.request();
        updateRequest.input("id", requestData.BinID);
        updateRequest.input("weight", requestData.Weight);
        const updateResult = await updateRequest.query(updateQuery);

        return updateResult.recordset[0];
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
    const selectQuery = 
      "SELECT BinID, weight FROM DisposalRequest WHERE DisposalID = @id";
    const selectRequest = connection.request();
    selectRequest.input("id", id);
    const selectResult = await selectRequest.query(selectQuery);
    const deleteQuery =
      "DELETE FROM DisposalRequest WHERE DisposalID = @id;";
    const deleteRequest = connection.request();
    deleteRequest.input("id", id);
    const deleteResult = await deleteRequest.query(deleteQuery);
    
    const { BinID, weight } = selectResult.recordset[0];
    const updateQuery = "UPDATE Bins SET currentCapacity = currentCapacity - @weight WHERE BinID = @id; SELECT * FROM Bins WHERE BinID = @id;";
    const updateRequest = connection.request();
    updateRequest.input("id", BinID);
    updateRequest.input("weight", weight);
    const updateResult = await updateRequest.query(updateQuery);

    return updateResult.recordset[0];
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