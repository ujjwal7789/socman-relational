// public/js/new-post.js

const token = localStorage.getItem('token');
const newPostForm = document.getElementById('newPostForm');
const formMessage = document.getElementById('formMessage');

// Add the event listener to the form
newPostForm.addEventListener('submit', async (event) => {
    // Prevent the page from reloading
    event.preventDefault();

    // Clear any previous messages
    formMessage.textContent = '';

    // Get the values from the form inputs
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    try {
        // --- 1. SEND the request to the API ---
        const response = await fetch('/api/forum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        });

        // --- 2. HANDLE the response from the API ---
        const data = await response.json(); // Get the JSON response

        // Check if the server reported an error
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create post.');
        }

        // --- 3. On SUCCESS, give feedback and redirect ---
        formMessage.textContent = 'Post created successfully! Redirecting to the forum...';
        formMessage.style.color = 'green';

        // Wait for 2 seconds, then redirect the user to the main forum page
        setTimeout(() => {
            window.location.href = '/forum'; // Or '/forum-views' if you used that prefix
        }, 2000);

    } catch (error) {
        // --- 4. On FAILURE, show the error message ---
        formMessage.textContent = `Error: ${error.message}`;
        formMessage.style.color = 'red';
    }
});