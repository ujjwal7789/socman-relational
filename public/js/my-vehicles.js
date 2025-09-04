// public/js/my-vehicles.js

const token = localStorage.getItem('token');
const vehiclesTableBody = document.getElementById('vehiclesTableBody');
const createVehicleForm = document.getElementById('createVehicleForm');
const formMessage = document.getElementById('formMessage');

// --- Function to fetch and display the resident's vehicles ---
const fetchMyVehicles = async () => {
    try {
        const response = await fetch('/api/vehicles/my-vehicles', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch your vehicles.');

        const vehicles = await response.json();
        vehiclesTableBody.innerHTML = '';

        if (vehicles.length === 0) {
            vehiclesTableBody.innerHTML = '<tr><td colspan="4" class="text-center p-4">You have not registered any vehicles.</td></tr>';
            return;
        }

        vehicles.forEach(vehicle => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${vehicle.vehicle_number}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">${vehicle.vehicle_type.replace('_', ' ')}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-600">${vehicle.model || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="deleteVehicle(${vehicle.id})" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            `;
            vehiclesTableBody.appendChild(row);
        });
    } catch (error) {
        vehiclesTableBody.innerHTML = `<tr><td colspan="4" class="text-center p-4 text-red-500">Error: ${error.message}</td></tr>`;
    }
};

// --- Event listener for the new vehicle form ---
createVehicleForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    formMessage.textContent = '';

    const vehicle_number = document.getElementById('vehicle_number').value.toUpperCase();
    const vehicle_type = document.getElementById('vehicle_type').value;
    const model = document.getElementById('model').value;

    try {
        const response = await fetch('/api/vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ vehicle_number, vehicle_type, model })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to register vehicle.');

        formMessage.textContent = 'Vehicle registered successfully!';
        formMessage.style.color = 'green';
        createVehicleForm.reset();
        fetchMyVehicles(); // Refresh the table

    } catch (error) {
        formMessage.textContent = `Error: ${error.message}`;
        formMessage.style.color = 'red';
    }
});

// --- Function to handle vehicle deletion ---
const deleteVehicle = async (vehicleId) => {
    if (!confirm('Are you sure you want to remove this vehicle?')) {
        return;
    }

    try {
        const response = await fetch(`/api/vehicles/${vehicleId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to delete vehicle.');
        }
        
        fetchMyVehicles(); // Refresh the table after successful deletion

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', fetchMyVehicles);