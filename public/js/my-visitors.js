// public/js/my-visitors.js

const token = localStorage.getItem('token');
const visitorsTableBody = document.getElementById('visitorsTableBody');
const createVisitorForm = document.getElementById('createVisitorForm');
const formMessage = document.getElementById('formMessage');

// --- Function to fetch and display the resident's visitors ---
const fetchMyVisitors = async () => {
    try {
        // We need to create this API endpoint next
        const response = await fetch('/api/visitors/my-visitors', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch your visitors.');

        const visitors = await response.json();
        visitorsTableBody.innerHTML = '';

        if (visitors.length === 0) {
            visitorsTableBody.innerHTML = '<tr><td colspan="5" class="text-center p-4">You have no visitor entries.</td></tr>';
            return;
        }

        visitors.forEach(visitor => {
            const row = document.createElement('tr');
            const entryTime = visitor.entry_time ? new Date(visitor.entry_time).toLocaleString() : 'N/A';
            const exitTime = visitor.exit_time ? new Date(visitor.exit_time).toLocaleString() : 'N/A';
            
            const canCancel = visitor.status === 'expected';

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${visitor.visitor_name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">${entryTime}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">${exitTime}</td>
                <td class="px-6 py-4 whitespace-nowrap font-semibold">${visitor.status}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${canCancel ? `<button onclick="cancelVisitor(${visitor.id})" class="text-red-600 hover:text-red-900">Cancel</button>` : ''}
                </td>
            `;
            visitorsTableBody.appendChild(row);
        });
    } catch (error) {
        visitorsTableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-red-500">Error: ${error.message}</td></tr>`;
    }
};

// --- Event listener for the new visitor form ---
createVisitorForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    formMessage.textContent = '';

    const visitor_name = document.getElementById('visitor_name').value;
    const visitor_phone = document.getElementById('visitor_phone').value;

    try {
        const response = await fetch('/api/visitors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ visitor_name, visitor_phone })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to add visitor.');

        formMessage.textContent = 'Visitor added successfully!';
        formMessage.style.color = 'green';
        createVisitorForm.reset();
        fetchMyVisitors(); // Refresh the table

    } catch (error) {
        formMessage.textContent = `Error: ${error.message}`;
        formMessage.style.color = 'red';
    }
});

// --- Function to handle canceling a visitor entry ---
const cancelVisitor = async (visitorId) => {
    if (!confirm('Are you sure you want to cancel this visitor entry?')) {
        return;
    }

    try {
        const response = await fetch(`/api/visitors/${visitorId}/cancel`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to cancel entry.');
        }
        
        fetchMyVisitors(); // Refresh the table to show the 'denied' status

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', fetchMyVisitors);