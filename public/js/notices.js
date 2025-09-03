const token = localStorage.getItem('token');
const noticeContainer = document.getElementById('noticesContainer');


const fetchNotices = async () => {
    try {
        const response = await fetch('/api/notices', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to get notices.');
        }

        const notices = await response.json();
        noticeContainer.innerHTML = '';

        if (notices.length === 0) {
            noticesContainer.innerHTML = '<p class="text-center text-gray-500">There are no notices to display at this time.</p>';
            return;
        }

        notices.forEach(notice => {
            const noticeCard = document.createElement('div');
            noticeCard.className = 'bg-white p-6 rounded-lg shadow-md border-1-4 border-indigo-50'; 

            const noticeDate = new Date(notice.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        
    
            noticeCard.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <h2 class="text-xl font-bold text-gray-800">${notice.title}</h2>
                    <span class="text-sm text-gray-500">${noticeDate}</span>
                </div>
                <p class="text-gray-700 mt-2">${notice.content}</p>
                <p class="text-right text-xs text-gray-400 mt-4">Posted by: ${notice.author.name}</p>`;

                noticeContainer.appendChild(noticeCard);
        });
    } catch (error) {
        noticesContainer.innerHTML = `<p class="text-center text-red-500">Error: ${error.message}</p>`;
    }
};

document.addEventListener('DOMContentLoaded', fetchNotices);

