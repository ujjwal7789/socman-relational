const token = localStorage.getItem('token');
const ticketsTableBody = document.getElementById('ticketsTableBody');
const createTicketForm = document.getElementById('createTicketForm');
const formMessage = document.getElementById('formMessage');

// --- Function to fetch and display the resident's tickets ---
const fetchMyTickets = async () => {
    try {
        const response = await fetch('/api/helpdesk/my-tickets', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch your tickets.');

        const tickets = await response.json();
        ticketsTableBody.innerHTML = '';

        if (tickets.length === 0) {
            ticketsTableBody.innerHTML = '<tr><td colspan="4" class="text-center p-4">You have not submitted any tickets.</td></tr>';
            return;
        }

        tickets.forEach(ticket => {
            const row = document.createElement('tr');
            const submittedDate = new Date(ticket.createdAt).toLocaleDateString();
            
            // Simple function to format the status with color
            const getStatusBadge = (status) => {
                const colors = {
                    pending: 'bg-yellow-100 text-yellow-800',
                    in_progress: 'bg-blue-100 text-blue-800',
                    resolved: 'bg-green-100 text-green-800',
                    closed: 'bg-gray-100 text-gray-800'
                };
                return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status] || ''}">${status.replace('_', ' ')}</span>`;
            };

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${ticket.title}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">${ticket.category}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">${submittedDate}</td>
                <td class="px-6 py-4 whitespace-nowrap">${getStatusBadge(ticket.status)}</td>
            `;
            ticketsTableBody.appendChild(row);
        });
    } catch (error) {
        ticketsTableBody.innerHTML = `<tr><td colspan="4" class="text-center p-4 text-red-500">Error: ${error.message}</td></tr>`;
    }
};

// --- Event listener for the new ticket form ---
createTicketForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    formMessage.textContent = '';

    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch('/api/helpdesk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, category, description })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to submit ticket.');

        formMessage.textContent = 'Ticket submitted successfully!';
        formMessage.style.color = 'green';
        createTicketForm.reset();
        fetchMyTickets(); // Refresh the table

    } catch (error) {
        formMessage.textContent = `Error: ${error.message}`;
        formMessage.style.color = 'red';
    }
});


// --- Initial Load ---
document.addEventListener('DOMContentLoaded', fetchMyTickets);