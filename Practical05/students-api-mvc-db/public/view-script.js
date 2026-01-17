// Get references to the elements
const viewStudentForm = document.getElementById("viewStudentForm");
const loadingMessageDiv = document.getElementById("loadingMessage"); // Element to show loading state
const messageDiv = document.getElementById("message"); // Element to display messages (success/error)
const studentIdInput = document.getElementById("studentId"); // Hidden input to store the student ID
const nameInput = document.getElementById("name"); // Input for the student name
const addressInput = document.getElementById("address"); // Input for the student address

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
        : { message: response.statusText };
      // Throw an error with status and message
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`
      );
    }

    // Parse the JSON response body into a JavaScript object
    const student = await response.json();
    return student; // Return the fetched student object
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
  studentIdInput.value = student.id; // Store the student ID in the hidden input
  nameInput.value = student.name; // Set the name input value
  addressInput.value = student.address; // Set the address input value
  loadingMessageDiv.style.display = "none"; // Hide the loading message
  viewStudentForm.style.display = "block"; // Show the view form
}

// --- Code to run when the page loads ---

// Get the student ID from the URL when the page loads
const studentIdToView = getStudentIdFromUrl();

// Check if a student ID was found in the URL
if (studentIdToView) {
  // If an ID exists, fetch the student data and then populate the form
  fetchStudentData(studentIdToView).then((student) => {
    if (student) {
      // If student data was successfully fetched, populate the form
      populateForm(student);
    } else {
      // Handle the case where fetchStudentData returned null (student not found or error)
      loadingMessageDiv.textContent = "Student not found or failed to load.";
      messageDiv.textContent = "Could not find the student to view.";
      messageDiv.style.color = "red";
    }
  });
} else {
  // Handle the case where no student ID was provided in the URL
  loadingMessageDiv.textContent = "No student ID specified for viewing.";
  messageDiv.textContent =
    "Please provide a student ID in the URL (e.g., view.html?id=1).";
  messageDiv.style.color = "orange";
}

// --- Start of code for learners to complete (Form Submission / PUT Request) ---

// Add an event listener for the form submission (for the Update operation)
viewStudentForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default browser form submission
  console.log("Edit student with ID:", studentIdToView);
  // Redirect to edit.html with the student ID
  window.location.href = `edit.html?id=${studentIdToView}`;
});
