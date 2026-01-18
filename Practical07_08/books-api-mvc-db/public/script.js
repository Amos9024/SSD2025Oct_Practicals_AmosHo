// Get references to the HTML elements you'll interact with:
const booksListDiv = document.getElementById("booksList");
const fetchBooksBtn = document.getElementById("fetchBooksBtn");
const messageDiv = document.getElementById("message"); // Get reference to the message div
const apiBaseUrl = "http://localhost:3000";

// Function to fetch books from the API and display them
async function fetchBooks() {
  try {
    booksListDiv.innerHTML = "Loading books..."; // Show loading state
    messageDiv.textContent = ""; // Clear any previous messages (assuming a message div exists or add one)

    // Make a GET request to your API endpoint
    const response = await fetch(`${apiBaseUrl}/books`);

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      // Attempt to read error body if available, otherwise use status text
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`
      );
    }

    // Parse the JSON response
    const books = await response.json();

    // Clear previous content and display books
    booksListDiv.innerHTML = ""; // Clear loading message
    if (books.length === 0) {
      booksListDiv.innerHTML = "<p>No books found.</p>";
    } else {
      books.forEach((book) => {
        const bookElement = document.createElement("div");
        //bookElement.classList.add("book-item");
        bookElement.classList.add("row", "mb-3", "p-3", "border", "rounded");
        // Use data attributes or similar to store ID on the element if needed later
        bookElement.setAttribute("data-book-id", book.id);
        bookElement.innerHTML = `
                    <div class="col-md-3">
                    <h5>${book.title}</h5>
                    </div>
                    <div class="col-md-3">
                    Author: ${book.author}
                    </div>
                    <div class="col-md-2">
                    ID: ${book.id}
                    </div>
                    <div class="col-md-4">
                    <button class="btn btn-success" onclick="viewBookDetails(${book.id})">View Details</button>
                    <button class="btn btn-warning" onclick="editBook(${book.id})">Edit</button>
                    <button class="btn btn-danger delete-btn" data-id="${book.id}">Delete</button>
                    </div>
                `;
        booksListDiv.appendChild(bookElement);
      });
      // Add event listeners for delete buttons after they are added to the DOM
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleDeleteClick);
      });
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    booksListDiv.innerHTML = `<p style="color: red;">Failed to load books: ${error.message}</p>`;
  }
}

// Placeholder functions for other actions (to be implemented later or in other files)
function viewBookDetails(bookId) {
  console.log("View details for book ID:", bookId);
  // In a real app, redirect to view.html or show a modal
  window.location.href = `view.html?id=${bookId}`; // Assuming you create view.html
  //alert(`View details for book ID: ${bookId} (Not implemented yet)`);
}

function editBook(bookId) {
  console.log("Edit book with ID:", bookId);
  // In a real app, redirect to edit.html with the book ID
  window.location.href = `edit.html?id=${bookId}`; // Assuming you create edit.html
}

// Placeholder/Partial implementation for Delete (will be completed by learners)
async function handleDeleteClick(event) {
  const bookId = event.target.getAttribute("data-id");
  //alert("BookID: " + bookId);
  console.log("Attempting to delete book with ID:", bookId);
  // --- Start of code for learners to complete ---
  // alert(
  //   `Attempting to delete book with ID: ${bookId} (Not implemented yet)`
  // );
  // TODO: Implement the fetch DELETE request here
  try {
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`, {
      method: "DELETE", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Tell the API we are sending JSON
      },
    });

    // TODO: Set the 'Content-Type': 'application/json' header
    const responseBody = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : { message: response.statusText, error: response.error };

    // TODO: Handle success (204, 200) and error responses (404, 500)
    if (response.status === 204 || response.status === 200) {
      messageDiv.textContent = `Book deleted successfully! ID: ${bookId}`;
      messageDiv.style.color = "green";
      // TODO: On successful deletion, remove the book element from the DOM
      const bookElement = event.target.closest(".book-item");
      if (bookElement) {
        bookElement.remove();
      }    
    } else if (response.status === 404) {
      // Handle book not found error
      messageDiv.textContent = `Book Not Found Error: ${responseBody.message}`;
      messageDiv.style.color = "red";
      console.error("Book Not Found Error:", responseBody);
    } else {
      // Handle other potential API errors (e.g., 500 from error handling middleware)
      throw new Error(
        `API error! status: ${response.status}, message: ${responseBody.message}`
      );
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    messageDiv.textContent = `Failed to delete book: ${error.message}`;
    messageDiv.style.color = "red";
  }
  // --- End of code for learners to complete ---
}

// Fetch books when the button is clicked
fetchBooksBtn.addEventListener("click", fetchBooks);

// Optionally, fetch books when the page loads
window.addEventListener('load', fetchBooks); // Or call fetchBooks() directly