const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all bins
async function getAllBins() {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = "SELECT BinID, LocationID, currentCapacity, MaxCapacity, Country, BinStatus FROM Bins";
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

async function getBinById(id) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = "SELECT BinID, LocationID, currentCapacity, MaxCapacity, Country, BinStatus FROM Bins WHERE BinID = @id";
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return null; // Bin not found
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

// Create new bin
async function createBin(binData) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = "INSERT INTO Bins (BinID, LocationID, currentCapacity, MaxCapacity, Country, BinStatus) VALUES (@BinID, @locationId, @currentCapacity, @maxCapacity, @country, @binStatus); SELECT SCOPE_IDENTITY() AS BinID;";
        const request = connection.request();
        request.input("BinID", binData.BinID);          
        request.input("locationId", binData.LocationID);
        request.input("currentCapacity", binData.currentCapacity);
        request.input("maxCapacity", binData.MaxCapacity);
        request.input("country", binData.Country);
        request.input("binStatus", binData.BinStatus);
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

// Update an existing bin
async function updateBin(id, binData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "UPDATE Bins SET LocationID = @locationId, currentCapacity = @currentCapacity, MaxCapacity = @maxCapacity, Country = @country, BinStatus = @binStatus WHERE BinID = @id; SELECT * FROM Bins WHERE BinID = @id;";
    const request = connection.request();
    request.input("id", id);
    request.input("locationId", binData.LocationID);
    request.input("currentCapacity", binData.currentCapacity);
    request.input("maxCapacity", binData.MaxCapacity);
    request.input("country", binData.Country);
    request.input("binStatus", binData.BinStatus);
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

// delete an existing bin
async function deleteBin(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "DELETE FROM Bins WHERE BinID = @id;";
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
  getAllBins,
  getBinById,
  createBin,
  updateBin,
  deleteBin,
};