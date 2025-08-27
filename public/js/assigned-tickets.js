// public/js/assigned-tickets.js

const token = localStorage.getItem('token');
const ticketsTableBody = document.getElementById('ticketsTableBody');

// Let's name this function more accurately
const fetchAssignedTickets = async () => {
    try {
        const response = await fetch('/api/helpdesk/assigned-to-me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch assigned tickets.');

        const tickets = await response.json();
        ticketsTableBody.innerHTML = '';

        if (tickets.length === 0) {
            ticketsTableBody.innerHTML = '<tr><td colspan="5" class="text-center p-4">You have no tickets assigned to you.</td></tr>';
            return;
        }

        tickets.forEach(ticket => {
            const row = document.createElement('tr');
            const submittedDate = new Date(ticket.createdAt).toLocaleDateString();

            // COPIED FROM ADMIN SCRIPT: Logic to build the dropdown
            const statusDropdown = `
                <select onchange="updateTicketStatus(${ticket.id}, this.value)" class="p-1 border border-gray-300 rounded-md">
                    <option value="pending" ${ticket.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="in_progress" ${ticket.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                    <option value="resolved" ${ticket.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                    <option value="closed" ${ticket.status === 'closed' ? 'selected' : ''}>Closed</option>
                </select>
            `;
            
            row.innerHTML = `
                <td class="px-6 py-4 font-medium text-gray-900">${ticket.title}</td>
                <td class="px-6 py-4">
                    ${ticket.requester.name}
                    <div class="text-xs text-gray-500">${ticket.requester.apartmentDetails?.apartment_number || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 text-gray-600">${ticket.category}</td>
                <td class="px-6 py-4 text-gray-600">${submittedDate}</td>
                <td class="px-6 py-4">${statusDropdown}</td>
            `;
            ticketsTableBody.appendChild(row);
        });
    } catch (error) {
        ticketsTableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-red-500">Error: ${error.message}</td></tr>`;
    }
};

// COPIED FROM ADMIN SCRIPT: The generic update function
const updateTicket = async (ticketId, updateData) => {
    try {
        const response = await fetch(`/api/helpdesk/${ticketId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) throw new Error('Failed to update ticket.');
        console.log(`Ticket ${ticketId} updated successfully.`);
    } catch (error) {
        alert(`Error: ${error.message}`);
        fetchAssignedTickets(); // Refresh on error
    }
};

// This function now works because updateTicket is defined
const updateTicketStatus = (ticketId, newStatus) => {
    updateTicket(ticketId, { status: newStatus });
};

// Initial Load
document.addEventListener('DOMContentLoaded', fetchAssignedTickets);