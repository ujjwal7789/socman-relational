const token = localStorage.getItem('token');
const ticketsTableBody = document.getElementById('ticketsTableBody');

// --- Main function to fetch and display ALL tickets ---
const fetchAllTickets = async () => {
    try {
        // 1. Call the admin API endpoint
        const response = await fetch('/api/helpdesk', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch help desk tickets.');

        const tickets = await response.json();
        ticketsTableBody.innerHTML = '';

        if (tickets.length === 0) {
            ticketsTableBody.innerHTML = '<tr><td colspan="5" class="text-center p-4">No tickets have been submitted.</td></tr>';
            return;
        }

        tickets.forEach(ticket => {
            const row = document.createElement('tr');
            const submittedDate = new Date(ticket.createdAt).toLocaleDateString();

            // The status will be a dropdown menu for the admin to change
            const statusDropdown = `
                <select onchange="updateTicketStatus(${ticket.id}, this.value)" class="p-1 border border-gray-300 rounded-md">
                    <option value="pending" ${ticket.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="in_progress" ${ticket.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                    <option value="resolved" ${ticket.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                    <option value="closed" ${ticket.status === 'closed' ? 'selected' : ''}>Closed</option>
                </select>
            `;

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${ticket.title}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-800">${ticket.requester.name}
                    <div class="text-xs text-gray-500">${ticket.requester.apartmentDetails?.apartment_number || 'N/A'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">${ticket.category}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">${submittedDate}</td>
                <td class="px-6 py-4 whitespace-nowrap">${statusDropdown}</td>
            `;
            ticketsTableBody.appendChild(row);
        });
    } catch (error) {
        ticketsTableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-red-500">Error: ${error.message}</td></tr>`;
    }
};

// --- Function to handle updating a ticket's status ---
const updateTicketStatus = async (ticketId, newStatus) => {
    try {
        // 2. Call the update API endpoint
        const response = await fetch(`/api/helpdesk/${ticketId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to update status.');
        }

        // Optional: Show a subtle confirmation
        console.log(`Ticket ${ticketId} status updated to ${newStatus}`);
        // The table will visually update because the dropdown's selected value has changed.
        // For a more robust UI, you could re-fetch all tickets, but this is efficient.

    } catch (error) {
        alert(`Error: ${error.message}`);
        fetchAllTickets(); // Re-fetch to reset the dropdown to its original state on error
    }
};

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', fetchAllTickets);