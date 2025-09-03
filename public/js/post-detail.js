// public/js/post-detail.js

// --- 1. SETUP ---
const token = localStorage.getItem('token');
const currentUser = JSON.parse(localStorage.getItem('user')); // Get the logged-in user's info

const postDetailContainer = document.getElementById('postDetailContainer');
const commentsContainer = document.getElementById('commentsContainer');
const commentForm = document.getElementById('commentForm');
const commentFormMessage = document.getElementById('commentFormMessage');

const pathParts = window.location.pathname.split('/');
const postId = pathParts[pathParts.length - 1];


// --- 2. THE "READ" FUNCTIONALITY ---
const fetchPostAndComments = async () => {
    try {
        const response = await fetch(`/api/forum/${postId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch post details.');
        }

        const post = await response.json();

        // --- Render the Main Post ---
        const postDate = new Date(post.createdAt).toLocaleString();
        
        // Define permission for deleting the POST
        const canDeletePost = currentUser.role === 'admin' || currentUser.id === post.author_id;

        postDetailContainer.innerHTML = `
            <div class="border-b pb-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">${post.title}</h1>
                        <p class="text-sm text-gray-500 mt-2">
                            Posted by <span class="font-semibold">${post.author.name}</span> on ${postDate}
                        </p>
                    </div>
                    ${canDeletePost ? `<button onclick="deletePost(${post.id})" class="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-red-700">Delete Post</button>` : ''}
                </div>
            </div>
            <div class="mt-4 text-gray-800 text-lg leading-relaxed">${post.content.replace(/\n/g, '<br>')}</div>
        `;

        // --- Render the Comments (inside its own block) ---
        commentsContainer.innerHTML = ''; // Clear "Loading..."
        if (post.comments && post.comments.length > 0) {
            post.comments.forEach(comment => {
                const commentEl = document.createElement('div');
                commentEl.className = 'bg-gray-50 p-4 rounded-lg border';
                const commentDate = new Date(comment.createdAt).toLocaleString();
                
                // Define permission for deleting the COMMENT
                const canDeleteComment = currentUser.role === 'admin' || currentUser.id === comment.author_id;
                
                commentEl.innerHTML = `
                    <div class="flex justify-between items-start">
                        <p class="text-gray-800">${comment.comment_text}</p>
                        ${canDeleteComment ? `<button onclick="deleteComment(${comment.id})" class="text-red-600 hover:text-red-900 text-xs font-bold">Delete</button>` : ''}
                    </div>
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
        commentsContainer.innerHTML = '';
    }
};


// --- 3. THE "CREATE COMMENT" FUNCTIONALITY --- (Your code here was already great)
commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    commentFormMessage.textContent = '';
    const commentText = document.getElementById('commentText').value;

    try {
        const response = await fetch(`/api/forum/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ comment_text: commentText })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to post comment.');
        }
        commentForm.reset();
        fetchPostAndComments(); 
    } catch (error) {
        commentFormMessage.textContent = `Error: ${error.message}`;
        commentFormMessage.style.color = 'red';
    }
});


// --- DELETE FUNCTIONS --- (Your code here was already great)
const deletePost = async (postIdToDelete) => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    try {
        const response = await fetch(`/api/forum/${postIdToDelete}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to delete post.');
        }
        alert('Post deleted successfully.');
        window.location.href = '/forum'; // Or '/forum-views'
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

const deleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
        const response = await fetch(`/api/forum/comments/${commentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to delete comment.');
        }
        alert('Comment deleted successfully.');
        fetchPostAndComments();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};


// --- 4. INITIAL LOAD ---
document.addEventListener('DOMContentLoaded', fetchPostAndComments);