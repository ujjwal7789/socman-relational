// public/js/manage-notices.js

// --- 1. SETUP ---
// Get the token from local storage
const token = localStorage.getItem('token');

// Find the key HTML elements we need to interact with
const noticesContainer = document.getElementById('noticesContainer');
const createNoticeForm = document.getElementById('createNoticeForm');
const formMessage = document.getElementById('formMessage');


// --- 2. THE "READ" FUNCTIONALITY ---
// This function fetches all notices from the API and displays them as cards.
const fetchNotices = async () => {
    try {
        const response = await fetch('/api/notices', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notices.');
        }

        const notices = await response.json();
        
        // Clear the "Loading..." message
        noticesContainer.innerHTML = '';

        if (notices.length === 0) {
            noticesContainer.innerHTML = '<p class="text-center text-gray-500">No notices have been posted yet.</p>';
            return;
        }

        notices.forEach(notice => {
            const noticeCard = document.createElement('div');
            noticeCard.className = 'bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500 mb-4';

            const noticeDate = new Date(notice.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            noticeCard.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <h2 class="text-xl font-bold text-gray-800">${notice.title}</h2>
                    <span class="text-sm text-gray-500">${noticeDate}</span>
                </div>
                <p class="text-gray-700 mt-2">${notice.content}</p>
                <p class="text-right text-xs text-gray-400 mt-4">Posted by: ${notice.author.name}</p>
            `;
            noticesContainer.appendChild(noticeCard);
        });
    } catch (error) {
        noticesContainer.innerHTML = `<p class="text-center text-red-500">Error: ${error.message}</p>`;
    }
};


// --- 3. THE "CREATE" FUNCTIONALITY ---
// This adds an event listener to the form for when the admin submits it.
createNoticeForm.addEventListener('submit', async (event) => {
    // Prevent the default browser action of reloading the page
    event.preventDefault();
    formMessage.textContent = ''; // Clear any previous messages

    // Get the values from the form inputs
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    try {
        const response = await fetch('/api/notices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to submit notice.');
        }

        // --- On Success ---
        formMessage.textContent = 'Notice posted successfully!';
        formMessage.style.color = 'green';
        createNoticeForm.reset(); // Clear the form fields
        fetchNotices();         // IMPORTANT: Refresh the list to show the new notice

    } catch (error) {
        // --- On Failure ---
        formMessage.textContent = `Error: ${error.message}`;
        formMessage.style.color = 'red';
    }
});


// --- 4. INITIAL LOAD ---
// This is the first thing that runs when the page is loaded.
// It calls our fetchNotices function to populate the list.
document.addEventListener('DOMContentLoaded', fetchNotices);