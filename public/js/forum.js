// public/js/forum.js

// --- SETUP ---
const token = localStorage.getItem('token');
// FIX 1: Corrected the element ID to be plural
const postsContainer = document.getElementById('postsContainer');

// --- MAIN FUNCTION ---
// FIX 2: All logic is now inside an async function
const fetchAndDisplayPosts = async () => {
    // Clear the container first
    postsContainer.innerHTML = '<p class="text-center text-gray-500">Loading posts...</p>';

    try {
        // FIX 3: 'GET' is the default method, so we can simplify the fetch call
        const response = await fetch('/api/forum', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch posts.');
        }

        // FIX 4: Added 'await' to correctly get the JSON data
        const posts = await response.json();

        // Clear the "Loading..." message
        postsContainer.innerHTML = '';

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="text-center text-gray-500">No posts have been created yet.</p>';
            return;
        }

        posts.forEach(post => {
            // FIX 5: Create a link element first, then put the card inside it
            const postLink = document.createElement('a');
            postLink.href = `/forum/posts/${post.id}`; // Set the destination URL
            // Add classes to make the link block-level and styled on hover
            postLink.className = 'block bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 mb-4';

            // Now, set the inner HTML of the LINK
            postLink.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <h2 class="text-xl font-bold text-gray-800">${post.title}</h2>
                    <span class="text-sm text-gray-500">${new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <p class="text-gray-700 mt-2 truncate">${post.content}</p> <!-- 'truncate' class prevents long content -->
                <p class="text-right text-xs text-gray-400 mt-4">Posted by: ${post.author.name}</p>
            `;

            // Append the entire clickable link (with the card inside it) to the container
            postsContainer.appendChild(postLink);
        });
    } catch (error) {
        // FIX 6: Add error message to the main container
        postsContainer.innerHTML = `<p class="text-center text-red-500">Error: ${error.message}</p>`;
    }
};

// --- INITIAL LOAD ---
// This tells the browser to run our function once the HTML page is fully loaded.
document.addEventListener('DOMContentLoaded', fetchAndDisplayPosts);