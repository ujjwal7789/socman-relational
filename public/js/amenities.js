const token = localStorage.getItem('token');
const amenitiesTableBody = document.getElementById('amenitiesTableBody');
const createAmenityForm = document.getElementById('createAmenityForm');
const formMessage = document.getElementById('formMessage');

const fetchAmenities = async () => {
    try {
        // Call the API endpoint we created earlier
        const response = await fetch('/api/amenities', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch amenities.');

        const amenities = await response.json();
        amenitiesTableBody.innerHTML = ''; // Clear loading message

        if (amenities.length === 0) {
            amenitiesTableBody.innerHTML = '<tr><td colspan="3" class="text-center p-4">No amenities created yet.</td></tr>';
            return;
        }

        amenities.forEach(amenity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${amenity.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">${amenity.description || ''}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            `;
            amenitiesTableBody.appendChild(row);
        });
    } catch (error) {
        amenitiesTableBody.innerHTML = `<tr><td colspan="3" class="text-center p-4 text-red-500">Error: ${error.message}</td></tr>`;
    }
};

createAmenityForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const booking_rules = document.getElementById('booking_rules').value;

    try {
        const response = await fetch('/api/amenities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, description, booking_rules })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to create amenity.');

        formMessage.textContent = 'Amenity created successfully!';
        formMessage.style.color = 'green';
        createAmenityForm.reset();
        fetchAmenities(); // Refresh the table with the new data

    } catch (error) {
        formMessage.textContent = `Error: ${error.message}`;
        formMessage.style.color = 'red';
    }
});

// Initial fetch when the page loads
document.addEventListener('DOMContentLoaded', fetchAmenities);