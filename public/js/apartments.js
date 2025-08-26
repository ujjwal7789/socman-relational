const token = localStorage.getItem('token');

const apartmentsTableBody = document.getElementById('apartmentsTableBody');
const createApartmentForm = document.getElementById('createApartmentForm');
const formMessage = document.getElementById('formMessage');

const fetchApartments = async () => {
    try {
        const response = await fetch('/api/apartments', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch apartments');
        }

        const apartments = await response.json();

        apartmentsTableBody.innerHTML = '';

        if (apartments.length === 0) {
            apartmentsTableBody.innerHTML = '<tr><td colspan="4">No apartments found.</td></tr>';
            return;
        }

        apartments.forEach(apt => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${apt.apartment_number}</td>
                <td>${apt.block || 'N/A'}</td>
                <td>${apt.owner ? apt.owner.name : 'Unassigned'}</td>
                <td>
                    <button onclick="assignOwner(${apt.id})">Assign Owner</button>
                    <button onclick="deleteApartment(${apt.id})>Delete</button"
                </td>
            `;
            apartmentsTableBody.appendChild(row);
        });
    } catch (error) {
        apartmentsTableBody.innerHTML = `<tr><td colspan="4">Error: ${error.message}</td></tr>`;
        console.error(error);
    }
};


createApartmentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const apartmentNumber = document.getElementById('apartment_number').value;
    const block = document.getElementById('block').value;

    try {
        const response = await fetch('/api/apartments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ apartment_number: apartmentNumber, block: block })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        formMessage.textContent = 'Apartment created successfully!';
        formMessage.style.color = 'green';
        createApartmentForm.reset(); // Clear the form
        fetchApartments(); // Refresh the table

    } catch (error) {
        formMessage.textContent = `Error: ${error.message}`;
        formMessage.style.color = 'red';
    }
});

function assignOwner(apartmentId) {
    // We will use a simple prompt for now
    const ownerId = prompt(`Enter the User ID of the resident to assign to apartment ${apartmentId}:`);
    if (ownerId) {
        // Here you would call the PUT /api/apartments/:id/assign endpoint
        alert(`Assignment logic for Apartment ID ${apartmentId} to User ID ${ownerId} goes here.`);
        // To fully implement this, you'd make another fetch call.
    }
}

function deleteApartment(apartmentId) {
    if (confirm(`Are you sure you want to delete apartment ${apartmentId}?`)) {
        // Here you would call the DELETE /api/apartments/:id endpoint
        alert(`Deletion logic for Apartment ID ${apartmentId} goes here.`);
        // To fully implement this, you'd make another fetch call.
    }
}


// Run the fetchApartments function when the page loads
document.addEventListener('DOMContentLoaded', fetchApartments);