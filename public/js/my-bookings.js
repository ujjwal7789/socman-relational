const token = localStorage.getItem('token');
const bookingsTableBody = document.getElementById('bookingsTableBody');

const fetchMyBookings = async () => {
    try {
        // 1. Call our API endpoint for the resident's bookings
        const response = await fetch('/api/amenities/bookings/my-bookings', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch your bookings.');

        const bookings = await response.json();
        
        // Clear the "Loading..." message
        bookingsTableBody.innerHTML = '';

        if (bookings.length === 0) {
            bookingsTableBody.innerHTML = '<tr><td colspan="5" class="text-center p-4">You have not made any bookings yet.</td></tr>';
            return;
        }

        // 2. Loop through each booking and create a table row
        bookings.forEach(booking => {
            const row = document.createElement('tr');

            // Format dates to be more readable
            const startTime = new Date(booking.start_time).toLocaleString();
            const endTime = new Date(booking.end_time).toLocaleString();

            // Check if the booking can be cancelled (it's confirmed and in the future)
            const canCancel = booking.status === 'confirmed' && new Date(booking.start_time) > new Date();
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${booking.amenity.name}</td>
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
        bookingsTableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-red-500">Error: ${error.message}</td></tr>`;
    }
};

// --- Function to handle the cancel button click ---
const cancelBooking = async (bookingId) => {
    // 1. Ask for confirmation
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    try {
        // 2. Call the cancel API endpoint
        const response = await fetch(`/api/amenities/bookings/${bookingId}/cancel`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to cancel booking.');
        }

        alert('Booking cancelled successfully!');
        
        // 3. Refresh the table to show the updated status
        fetchMyBookings();

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};


// --- Initial Load ---
// Run the main fetch function when the page is fully loaded
document.addEventListener('DOMContentLoaded', fetchMyBookings);