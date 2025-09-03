// public/js/register.js

const registerForm = document.getElementById('registerForm');
const message = document.getElementById('message');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // By default, our backend API registers new users as 'resident'
    // which is what we want for a public registration form.

    message.textContent = ''; // Clear previous messages

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            message.textContent = 'Registration successful! You can now log in.';
            message.style.color = 'green';
            registerForm.reset(); // Clear the form
        } else {
            // Display error message from the server (e.g., "User already exists")
            throw new Error(data.message);
        }

    } catch (error) {
        message.textContent = `Error: ${error.message}`;
        message.style.color = 'red';
    }
});