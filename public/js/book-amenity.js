// public/js/book-amenity.js

const token = localStorage.getItem('token');
const amenitiesListDiv = document.getElementById('amenitiesList');
const createBookingForm = document.getElementById('createBookingForm');
const amenitySelect = document.getElementById('amenity');
const formMessage = document.getElementById('formMessage');

// Function to fetch amenities and populate both the cards and the select dropdown
const fetchAndDisplayAmenities = async () => {
    try {
        const response = await fetch('/api/amenities', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch amenities.');

        const amenities = await response.json();
        
        // Clear loading messages
        amenitiesListDiv.innerHTML = '';
        amenitySelect.innerHTML = '';

        if (amenities.length === 0) {
            amenitiesListDiv.innerHTML = '<p>No amenities are available for booking at this time.</p>';
            return;
        }

        amenities.forEach(amenity => {
            // Create a card for the amenity list
            const card = document.createElement('div');
            card.className = 'bg-white p-6 rounded-lg shadow-md';
            card.innerHTML = `
                <h3 class="font-bold text-lg text-gray-800">${amenity.name}</h3>
                <p class="text-gray-600 text-sm mt-1">${amenity.description || ''}</p>
                <p class="text-gray-500 text-xs mt-4"><strong>Rules:</strong> ${amenity.booking_rules || 'Standard rules apply.'}</p>
            `;
            amenitiesListDiv.appendChild(card);

            // Create an option for the select dropdown in the form
            const option = document.createElement('option');
            option.value = amenity.id;
            option.textContent = amenity.name;
            amenitySelect.appendChild(option);
        });

    } catch (error) {
        amenitiesListDiv.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    }
};

// Event listener for the booking form submission
createBookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const amenityId = amenitySelect.value;
    const startTime = document.getElementById('start_time').value;
    const endTime = document.getElementById('end_time').value;

    // The browser's datetime-local input gives a format like "YYYY-MM-DDThh:mm".
    // We need to convert it to the ISO 8601 format with 'Z' for UTC that our backend expects.
    const startTimeISO = new Date(startTime).toISOString();
    const endTimeISO = new Date(endTime).toISOString();

    try {
        // Call the API endpoint you created to make a booking
        const response = await fetch(`/api/amenities/${amenityId}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                start_time: startTimeISO,
                end_time: endTimeISO
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // This will catch 400, 404, 409 (conflict) errors from the backend
            throw new Error(data.message || 'Failed to create booking.');
        }

        formMessage.textContent = 'Booking successful!';
        formMessage.style.color = 'green';
        createBookingForm.reset();

    } catch (error) {
        formMessage.textContent = `Error: ${error.message}`;
        formMessage.style.color = 'red';
    }
});

// Initial fetch when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayAmenities);