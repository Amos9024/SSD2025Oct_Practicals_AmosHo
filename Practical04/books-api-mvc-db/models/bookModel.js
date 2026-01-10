const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all books
async function getAllBooks() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT id, title, author FROM Books";
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

// Get book by ID
async function getBookById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT id, title, author FROM Books WHERE id = @id";
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null; // Book not found
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

// Create new book
async function createBook(bookData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "INSERT INTO Books (title, author) VALUES (@title, @author); SELECT SCOPE_IDENTITY() AS id;";
    const request = connection.request();
    request.input("title", bookData.title);
    request.input("author", bookData.author);
    const result = await request.query(query);

    const newBookId = result.recordset[0].id;
    return await getBookById(newBookId);
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

// Update an existing book
async function updateBook(id, bookData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "UPDATE Books SET title = @title, author = @author WHERE id = @id; SELECT * FROM Books WHERE id = @id;";
    const request = connection.request();
    request.input("id", id);
    request.input("title", bookData.title);
    request.input("author", bookData.author);
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

// delete an existing book
async function deleteBook(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "DELETE FROM Books WHERE id = @id;";
    const request = connection.request();
    request.input("id", id);
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
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};