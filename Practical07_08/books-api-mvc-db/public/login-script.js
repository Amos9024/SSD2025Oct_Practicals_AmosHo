async function loginUser(event) 
{
    //Prevent event bubbling if called from a form submit event
    if (event) event.preventDefault(); 
    const apiBaseUrl = "http://localhost:3000";
    const messageDiv = document.getElementById("errMsg");
    messageDiv.textContent = ""; // Clear previous messages
    const loginForm = document.getElementById("loginForm");
    const userName = document.getElementById("userNameInput");
    const password = document.getElementById("passwordInput");

    const loginData = {
        username: userName.value,
        password: password.value,
    };
    console.log(loginData);

    try {
        // Make a POST request to your API endpoint
        const response = await fetch(`${apiBaseUrl}/login`, {
            method: "POST", // Specify the HTTP method
            headers: {
                "Content-Type": "application/json", // Tell the API we are sending JSON
            },
            body: JSON.stringify(loginData), // Send the data as a JSON string in the request body
        });

        // Check for API response status (e.g., 201 Created, 400 Bad Request, 500 Internal Server Error)
        const responseBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };

        if (response.status === 200 || response.status === 201 ) {
            console.log("Login successful");
            messageDiv.textContent = "Login successful";
            messageDiv.style.color = "green";
            // Store JWT token in local storage
            if (responseBody.token) {
                localStorage.setItem("jwtToken", responseBody.token);
            }
            loginForm.reset(); // Clear the form after success
            window.location.href = "index.html"; // Redirect user to books page.
        } else if (response.status === 401) {
            // Handle validation errors from the API (from Practical 04 validation middleware)
            messageDiv.textContent = `Authentication Error: ${responseBody.message}`;
            messageDiv.style.color = "red";
            console.log("Login failed");
        } else {
            // Handle other potential API errors (e.g., 500 from error handling middleware)
            throw new Error(
                `API error! status: ${response.status}, message: ${responseBody.message}`
            );
        }
    } catch (error) {
        messageDiv.textContent = `Failed to login: ${error.message}`;
        messageDiv.style.color = "red";
    }
}

function logoutUser(event) 
{
    if (event) event.preventDefault();
    // Remove the JWT token from localStorage
    localStorage.removeItem("jwtToken");
    // Redirect to login page
    window.location.href = "login.html"; 
}