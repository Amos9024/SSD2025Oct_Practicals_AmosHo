const booksController = require("../controllers/bookController");
const Book = require("../models/bookModel");


// Mock the Book model
jest.mock("../models/bookModel"); // Replace with the actual path to your Book model

describe("booksController.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all books and return a JSON response", async () => {
    const mockBooks = [
      { id: 1, title: "The Lord of the Rings" },
      { id: 2, title: "The Hitchhiker's Guide to the Galaxy" },
    ];

    // Mock the Book.getAllBooks function to return the mock data
    Book.getAllBooks.mockResolvedValue(mockBooks);

    const req = {};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock the res.json function
    };

    await booksController.getAllBooks(req, res);

    expect(Book.getAllBooks).toHaveBeenCalledTimes(1); // Check if getAllBooks was called
    expect(res.json).toHaveBeenCalledWith(mockBooks); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Book.getAllBooks.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      
    };

    await booksController.getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving books");
  });
});



describe("booksController.updateBookAvailability", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all books and return a JSON response", async () => {
    const mockBooks = [
      { id: 1, title: "The Lord of the Rings", availability: "Y" },
      { id: 2, title: "The Hitchhiker's Guide to the Galaxy", availability: "N" },
    ];

    // Mock the Book.updateBookAvailability function to return the mock data
    Book.updateBookAvailability.mockResolvedValue(mockBooks);

    const req = {};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // Mock the res.json function
    };

    await booksController.updateBookAvailability(req, res);
    expect(Book.updateBookAvailability).toHaveBeenCalledTimes(1); // Check if updateBookAvailability was called
    expect(res.json).toHaveBeenCalledWith(mockBooks); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Book.updateBookAvailability.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
      
    };

    await booksController.updateBookAvailability(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error updating book availability" });
  });
});