// public/js/helpdesk-admin.js

const token = localStorage.getItem('token');
const ticketsTableBody = document.getElementById('ticketsTableBody');

// We'll store the list of staff members here to reuse it
let staffList = [];

// --- 1. NEW function to fetch the list of staff ---
const fetchStaff = async () => {
    try {
        const response = await fetch('/api/users/staff', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch staff list.');
        staffList = await response.json();
    } catch (error) {
        console.error("Could not fetch staff list:", error);
        // Handle the error, maybe show a message on the page
    }
};

// --- 2. Main function to fetch and display ALL tickets (UPGRADED) ---
const fetchAllTickets = async () => {
    try {
        const response = await fetch('/api/helpdesk', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch help desk tickets.');

        const tickets = await response.json();
        ticketsTableBody.innerHTML = '';

        if (tickets.length === 0) {
            ticketsTableBody.innerHTML = '<tr><td colspan="6" class="text-center p-4">No tickets have been submitted.</td></tr>';
            return;
        }

        tickets.forEach(ticket => {
            const row = document.createElement('tr');
            const submittedDate = new Date(ticket.createdAt).toLocaleDateString();

            // --- Build the "Assigned To" dropdown ---
            let assignedToDropdown = `<select onchange="updateTicketAssignment(${ticket.id}, this.value)" class="p-1 border border-gray-300 rounded-md">`;
            // Add a default "Unassigned" option
            assignedToDropdown += `<option value="">Unassigned</option>`;
            // Loop through the fetched staff list
            staffList.forEach(staff => {
                assignedToDropdown += `
                    <option value="${staff.id}" ${ticket.assigned_to === staff.id ? 'selected' : ''}>
                        ${staff.name} (${staff.role})
                    </option>
                `;
            });
            assignedToDropdown += `</select>`;

            // --- Build the "Status" dropdown ---
            const statusDropdown = `
                <select onchange="updateTicketStatus(${ticket.id}, this.value)" class="p-1 border border-gray-300 rounded-md">
                    <option value="pending" ${ticket.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="in_progress" ${ticket.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                    <option value="resolved" ${ticket.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                    <option value="closed" ${ticket.status === 'closed' ? 'selected' : ''}>Closed</option>
                </select>
            `;

            row.innerHTML = `
                <td class="px-6 py-4 ...">${ticket.title}</td>
                <td class="px-6 py-4 ...">${ticket.requester.name}</td>
                <td class="px-6 py-4 ...">${ticket.category}</td>
                <td class="px-6 py-4 ...">${submittedDate}</td>
                <td class="px-6 py-4 ...">${assignedToDropdown}</td>
                <td class="px-6 py-4 ...">${statusDropdown}</td>
            `;
            ticketsTableBody.appendChild(row);
        });
    } catch (error) {
        ticketsTableBody.innerHTML = `<tr><td colspan="6" class="text-center p-4 text-red-500">Error: ${error.message}</td></tr>`;
    }
};

// --- Generic function to update any part of a ticket ---
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

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to update ticket.');
        }
        console.log(`Ticket ${ticketId} updated successfully.`);

    } catch (error) {
        alert(`Error: ${error.message}`);
        fetchAllTickets(); // Re-fetch all data to ensure UI consistency on error
    }
};

// --- Helper functions that call the generic updateTicket function ---
const updateTicketStatus = (ticketId, newStatus) => {
    updateTicket(ticketId, { status: newStatus });
};

const updateTicketAssignment = (ticketId, newAssigneeId) => {
    // If the admin selects "Unassigned", send null to the backend
    const assigneeId = newAssigneeId ? parseInt(newAssigneeId, 10) : null;
    updateTicket(ticketId, { assigned_to: assigneeId });
};

// --- Initial Load ---
// We now need to run two functions when the page loads.
// We must fetch the staff list FIRST, then fetch the tickets.
document.addEventListener('DOMContentLoaded', async () => {
    await fetchStaff();
    await fetchAllTickets();
});