const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all students
async function getAllStudents() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT student_id, name, address FROM Students";
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

// Get student by ID
async function getStudentById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT student_id, name, address FROM Students WHERE student_id = @student_id";
    const request = connection.request();
    request.input("student_id", id);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null; // Student not found
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

// Create new student
async function createStudent(studentData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "INSERT INTO Students (name, address) VALUES (@name, @address); SELECT SCOPE_IDENTITY() AS id;";
    const request = connection.request();
    request.input("name", studentData.name);
    request.input("address", studentData.address);
    const result = await request.query(query);

    const newStudentId = result.recordset[0].id;
    return await getStudentById(newStudentId);
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

// Update an existing student
async function updateStudent(id, studentData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "UPDATE Students SET name = @name, address = @address WHERE student_id = @student_id; SELECT * FROM Students WHERE student_id = @student_id;";
    const request = connection.request();
    request.input("student_id", id);
    request.input("name", studentData.name);
    request.input("address", studentData.address);
    const result = await request.query(query);
    return result.rowsAffected[0];
   /* if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: `No book found with id ${id}.` });
    }
    res.json({
      message: `Book with id ${id} updated successfully.`,
      book: { id, title: bookData.title, author: bookData.author },
    });*/

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

// delete an existing student
async function deleteStudent(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "DELETE FROM Students WHERE student_id = @student_id;";
    const request = connection.request();
    request.input("student_id", id);
    const result = await request.query(query);
    return result.rowsAffected[0];
    /* if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: `No book found with id ${id}.` });
    }
    res.json({
      message: `Book with id ${id} deleted successfully.`
    });*/

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
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};