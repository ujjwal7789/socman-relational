const token = localStorage.getItem('token');
const bookingsTableBody = document.getElementById('bookingsTableBody');

// --- Main function to fetch and display ALL bookings ---
const fetchAllBookings = async () => {
    try {
        // 1. Call the ADMIN API endpoint for all bookings
        const response = await fetch('/api/amenities/bookings', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch bookings.');

        const bookings = await response.json();
        
        bookingsTableBody.innerHTML = ''; // Clear loading message

        if (bookings.length === 0) {
            bookingsTableBody.innerHTML = '<tr><td colspan="6" class="text-center p-4">No bookings found in the system.</td></tr>';
            return;
        }

        // 2. Loop through each booking and create a table row
        bookings.forEach(booking => {
            const row = document.createElement('tr');

            const startTime = new Date(booking.start_time).toLocaleString();
            const endTime = new Date(booking.end_time).toLocaleString();
            
            const canCancel = booking.status === 'confirmed' && new Date(booking.start_time) > new Date();
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${booking.amenity.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-800">${booking.resident.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">${startTime}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">${endTime}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${booking.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${canCancel ? `<button onclick="cancelBooking(${booking.id})" class="text-red-600 hover:text-red-900">Cancel</button>` : 'N/A'}
                </td>
            `;
            bookingsTableBody.appendChild(row);
        });

    } catch (error) {
        bookingsTableBody.innerHTML = `<tr><td colspan="6" class="text-center p-4 text-red-500">Error: ${error.message}</td></tr>`;
    }
};

// --- Function to handle the cancel button click (can be identical to the one in my-bookings.js) ---
const cancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    try {
        const response = await fetch(`/api/amenities/bookings/${bookingId}/cancel`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to cancel booking.');
        }

        alert('Booking cancelled successfully!');
        
        // Refresh the table with the updated data
        fetchAllBookings();

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', fetchAllBookings);