const bookModel = require("../models/bookModel");

// Get all books
async function getAllBooks(req, res) {
  try {
    const user = req.user; // Get user from request
    console.log("User from request:", user);
    const books = await bookModel.getAllBooks();
    //res.json(books);
    res.status(200).json(books); // Return both user and books
  } catch (error) {
    //console.error("Controller error:", error);
    //res.status(500).json({ error: "Error retrieving books" });
    res.status(500).send("Error retrieving books");
  }
}

// Get book by ID
async function getBookById(req, res) {
  try {
    const id = parseInt(req.params.id);
    //const user = req.user; // Get user from request
    //console.log("User from request:", user);
    console.log("Fetching book with ID:", id);
    const book = await bookModel.getBookById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
    //res.json({ user, book }); // Return both user and book
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving book" });
  }
}

// Create new book
async function createBook(req, res) {
  try {
    const user = req.user; // Get user from request
    const newBook = await bookModel.createBook(req.body);
    //res.status(201).json(newBook);
    res.status(201).json({ user, newBook }); // Return both user and new book
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating book" });
  }
}

// Update existing book
async function updateBook(req, res) {
  try {
    const user = req.user; // Get user from request
    const id = parseInt(req.params.id);
    const result = await bookModel.updateBook(id, req.body);
    if (result === 0) {
      return res.status(404).send("Book not found");
    }
    const updatedBook = await bookModel.getBookById(id);
    res.json({
      message: `Book with id ${id} updated successfully.`,
      book: updatedBook,
      user: user
    });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating book" });
  }
}

// Update book availability
async function updateBookAvailability(req, res) {
  try {
    const id = parseInt(req.params.bookId);
    console.log("Updating availability for book ID:", id);
    const success = await bookModel.updateBookAvailability(id, req.body);
    if (!success) {
      return res.status(404).json({ error: "Book not found" });
    }
    const updatedBook = await bookModel.getBookById(id);
    res.json({
        message: `Book with id ${id} updated successfully.`,
        book: updatedBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating book availability" });
  }
};

// Delete existing book
async function deleteBook(req, res) {
  try {
    const id = parseInt(req.params.id);
    const result = await bookModel.deleteBook(id);
    if (result === 0) {
      return res.status(404).send("Book not found");
    }
    res.json({
      message: `Book with id ${id} deleted successfully.`
    });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error deleting book" });
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  updateBookAvailability,
  deleteBook,
};