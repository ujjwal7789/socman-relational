// public/js/gatekeeper.js

const token = localStorage.getItem('token');
const visitorsTableBody = document.getElementById('visitorsTableBody');

// --- Main function to fetch and display visitors for the gate ---
const fetchGateLog = async () => {
    try {
        // We will need to create this API endpoint
        const response = await fetch('/api/visitors/gate-log', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch visitor log.');

        const visitors = await response.json();
        visitorsTableBody.innerHTML = '';

        if (visitors.length === 0) {
            visitorsTableBody.innerHTML = '<tr><td colspan="4" class="text-center p-4">No expected or current visitors.</td></tr>';
            return;
        }

        visitors.forEach(visitor => {
            const row = document.createElement('tr');
            
        let actionButton = '';
        if (visitor.status === 'expected') {
            // --- STYLED "Check In" Button ---
            actionButton = `
                <button 
                    onclick="checkInVisitor(${visitor.id})" 
                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md text-xs transition duration-200"
                >
                    Check In
                </button>
            `;
    
        } else if (visitor.status === 'arrived') {
            // --- STYLED "Check Out" Button ---
            actionButton = `
                <button 
                    onclick="checkOutVisitor(${visitor.id})" 
                    class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded-md text-xs transition duration-200"
                >
                    Check Out
                </button>
            `;
        }

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${visitor.visitor_name}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${visitor.resident.name}
                    <div class="text-xs text-gray-500">${visitor.resident.apartmentDetails?.apartment_number || ''}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap font-semibold">${visitor.status}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${actionButton}
                </td>
            `;
            visitorsTableBody.appendChild(row);
        });
    } catch (error) {
        visitorsTableBody.innerHTML = `<tr><td colspan="4" class="text-center p-4 text-red-500">Error: ${error.message}</td></tr>`;
    }
};

// --- Action Functions ---

const checkInVisitor = async (visitorId) => {
    try {
        const response = await fetch(`/api/visitors/${visitorId}/check-in`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to check in visitor.');
        }
        fetchGateLog(); // Refresh the list
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

const checkOutVisitor = async (visitorId) => {
    if (!confirm('Is this visitor leaving the premises?')) return;
    try {
        const response = await fetch(`/api/visitors/${visitorId}/check-out`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to check out visitor.');
        }
        fetchGateLog(); // Refresh the list
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', fetchGateLog);