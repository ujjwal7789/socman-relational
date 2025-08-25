// public/js/login.js

// Find the form and the error message element in the HTML
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// Add an event listener to run code when the form is submitted
loginForm.addEventListener('submit', async (event) => {
    // Prevent the form from doing its default browser refresh
event.preventDefault();

// Get the email and password values from the input fields
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

// Clear any previous error messages
errorMessage.textContent = '';

try {
    // Use the browser's 'fetch' API to call our backend login route
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Tell the server we're sending JSON
        },
        // Convert the JavaScript object to a JSON string
        body: JSON.stringify({ email, password })
    });

    // Parse the JSON response from the server
    const data = await response.json();

    if (response.ok) { // The request was successful (status code 200-299)
        // Save the token and user info in the browser's local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect the user to their dashboard (we will create this next)
        window.location.href = '/dashboard';
    } else {
        // The request failed, show the error message from the server
        errorMessage.textContent = data.message;
    }

} catch (error) {
    // This catches network errors etc.
    errorMessage.textContent = 'An error occurred. Please try again.';
    console.error('Login error:', error);
}
});