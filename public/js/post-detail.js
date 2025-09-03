// public/js/post-detail.js

// --- 1. SETUP ---
const token = localStorage.getItem('token');

// Use the new, cleaner element IDs from our refined EJS file
const postDetailContainer = document.getElementById('postDetailContainer');
const commentsContainer = document.getElementById('commentsContainer');
const commentForm = document.getElementById('commentForm');
const commentFormMessage = document.getElementById('commentFormMessage');

// FIX 1: Correctly extract the post ID from the URL
// e.g., for "http://.../forum/posts/3", this will get "3"
const pathParts = window.location.pathname.split('/');
const postId = pathParts[pathParts.length - 1];


// --- 2. THE "READ" FUNCTIONALITY ---
const fetchPostAndComments = async () => {
    try {
        // FIX 2: Use a template literal to insert the real postId into the URL
        const response = await fetch(`/api/forum/${postId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch post details.');
        }

        // FIX 3: Add 'await' and handle the data correctly
        const post = await response.json();

        // --- Render the Main Post ---
        const postDate = new Date(post.createdAt).toLocaleString();
        postDetailContainer.innerHTML = `
            <div class="border-b pb-4">
                <h1 class="text-3xl font-bold text-gray-900">${post.title}</h1>
                <p class="text-sm text-gray-500 mt-2">
                    Posted by <span class="font-semibold">${post.author.name}</span> on ${postDate}
                </p>
            </div>
            <div class="mt-4 text-gray-800 text-lg leading-relaxed">${post.content.replace(/\n/g, '<br>')}</div>
        `; // .replace() turns line breaks into <br> tags

        // --- Render the Comments ---
        commentsContainer.innerHTML = ''; // Clear the "Loading..." message
        if (post.comments && post.comments.length > 0) {
            post.comments.forEach(comment => {
                const commentEl = document.createElement('div');
                commentEl.className = 'bg-gray-50 p-4 rounded-lg border';
                const commentDate = new Date(comment.createdAt).toLocaleString();
                
                commentEl.innerHTML = `
                    <p class="text-gray-800">${comment.comment_text}</p>
                    <p class="text-xs text-gray-500 mt-2">
                        Comment by <span class="font-semibold">${comment.author.name}</span> on ${commentDate}
                    </p>
                `;
                commentsContainer.appendChild(commentEl);
            });
        } else {
            commentsContainer.innerHTML = '<p class="text-gray-500">No comments yet. Be the first to reply!</p>';
        }

    } catch (error) {
        postDetailContainer.innerHTML = `<p class="text-red-500 text-center">Error: ${error.message}</p>`;
        commentsContainer.innerHTML = ''; // Clear the comments section on error
    }
};


// --- 3. THE "CREATE COMMENT" FUNCTIONALITY ---
commentForm.addEventListener('submit', async (event) => {
    // FIX 5: Use parentheses for the function call
    event.preventDefault();
    commentFormMessage.textContent = '';

    const commentText = document.getElementById('commentText').value;

    try {
        // FIX 2 (again): Use the real postId in the URL
        const response = await fetch(`/api/forum/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            // FIX 5: The key must be 'comment_text' to match the backend controller
            body: JSON.stringify({ comment_text: commentText })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to post comment.');
        }

        // --- On Success ---
        commentForm.reset(); // Reset the textarea
        // IMPORTANT: Re-run the fetch function to show the new comment instantly!
        fetchPostAndComments(); 

    } catch (error) {
        commentFormMessage.textContent = `Error: ${error.message}`;
        commentFormMessage.style.color = 'red';
    }
});


// --- 4. INITIAL LOAD ---
document.addEventListener('DOMContentLoaded', fetchPostAndComments);