// Get references to the elements
const editStudentForm = document.getElementById("editStudentForm");
const loadingMessageDiv = document.getElementById("loadingMessage"); // Element to show loading state
const messageDiv = document.getElementById("message"); // Element to display messages (success/error)
const studentIdInput = document.getElementById("studentId"); // Hidden input to store the student ID
const editNameInput = document.getElementById("editName"); // Input for the student name
const editAddressInput = document.getElementById("editAddress"); // Input for the student address

// Base URL for the API.
const apiBaseUrl = "http://localhost:3000";

// Function to get student ID from URL query parameter (e.g., edit.html?id=1)
function getStudentIdFromUrl() {
  const params = new URLSearchParams(window.location.search); // Get URL query parameters
  return params.get("id"); // Return the value of the 'id' parameter
}

// Function to fetch existing student data from the API based on ID
async function fetchStudentData(studentId) {
  try {
    // Make a GET request to the API endpoint for a specific student
    const response = await fetch(`${apiBaseUrl}/students/${studentId}`);

    // Check if the HTTP response status is not OK (e.g., 404, 500)
    if (!response.ok) {
      // Attempt to read error body if available (assuming JSON), otherwise use status text
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText, error: response.error };
      // Throw an error with status and message
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`
      );
    }

    // Parse the JSON response body into a JavaScript object
    const book = await response.json();
    return book; // Return the fetched book object
  } catch (error) {
    // Catch any errors during the fetch or processing
    console.error("Error fetching student data:", error);
    // Display an error message to the user
    messageDiv.textContent = `Failed to load student data: ${error.message}`;
    messageDiv.style.color = "red";
    loadingMessageDiv.textContent = ""; // Hide loading message if it was shown
    return null; // Indicate that fetching failed
  }
}

// Function to populate the form fields with the fetched student data
function populateForm(student) {
  studentIdInput.value = student.student_id; // Store the student ID in the hidden input
  editNameInput.value = student.name; // Set the name input value
  editAddressInput.value = student.address; // Set the address input value
  loadingMessageDiv.style.display = "none"; // Hide the loading message
  editStudentForm.style.display = "block"; // Show the edit form
}

// --- Code to run when the page loads ---

// Get the student ID from the URL when the page loads
const studentIdToEdit = getStudentIdFromUrl();
// Check if a book ID was found in the URL
if (studentIdToEdit) {
  // If an ID exists, fetch the student data and then populate the form
  fetchStudentData(studentIdToEdit).then((student) => {
    if (student) {
      // If student data was successfully fetched, populate the form
      populateForm(student);
    } else {
      // Handle the case where fetchStudentData returned null (student not found or error)
      loadingMessageDiv.textContent = "Student not found or failed to load.";
      messageDiv.textContent = "Could not find the student to edit.";
      messageDiv.style.color = "red";
    }
  });
} else {
  // Handle the case where no student ID was provided in the URL
  loadingMessageDiv.textContent = "No student ID specified for editing.";
  messageDiv.textContent =
    "Please provide a student ID in the URL (e.g., edit.html?id=1).";
  messageDiv.style.color = "orange";
}

// --- Start of code for learners to complete (Form Submission / PUT Request) ---

// Add an event listener for the form submission (for the Update operation)
editStudentForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default browser form submission

  console.log("Edit form submitted (PUT logic to be implemented)");
  //alert("Update logic needs to be implemented!"); // Placeholder alert

  // TODO: Collect updated data from form fields (editNameInput.value, editAddressInput.value)
  const updateStudentData = {
    name: editNameInput.value,
    address: editAddressInput.value,
  };

  // TODO: Get the student ID from the hidden input (studentIdInput.value)
  studentId = document.getElementById("studentId").value;

  try {
    // TODO: Implement the fetch PUT request to the API endpoint /students/:id
    const response = await fetch(`${apiBaseUrl}/students/${studentId}`, {
        method: "PUT", // Specify the HTTP method
        // TODO: Include the updated data in the request body (as JSON string)
        body: JSON.stringify(updateStudentData), // Send the data as a JSON string in the request body
        // TODO: Set the 'Content-Type': 'application/json' header
        headers: {
            "Content-Type": "application/json", // Tell the API we are sending JSON
        },
      });

    const responseBody = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : { message: response.statusText, error: response.error };
        
    // TODO: Handle the API response (check status 200 for success, 400 for validation, 404 if book not found, 500 for server error)
    if (response.status === 200) { 
        // If the response is successful (status 200)
        messageDiv.textContent = "Student updated successfully!";
        messageDiv.style.color = "green";
    }
    else if (response.status === 400) {
        // Handle validation errors from the API (from Practical 04 validation middleware)
        messageDiv.textContent = `Validation Error: ${responseBody.error}`;
        messageDiv.style.color = "red";
        console.error("Validation Error:", responseBody);
    } else {
        // Handle other potential API errors (e.g., 500 from error handling middleware)
        throw new Error(
            `API error! status: ${response.status}, message: ${responseBody.message}`
        );
    }
  }
  // TODO: Provide feedback to the user using the messageDiv (success or error messages)
  catch (error) {
    console.error("Error updating student:", error);
    messageDiv.textContent = `Failed to update student: ${error.message}`;
    messageDiv.style.color = "red";
  }
  // TODO: Optionally, redirect back to the index page on successful update
  window.location.href = "index.html";  
});

// --- End of code for learners to complete ---