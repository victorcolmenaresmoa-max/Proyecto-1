import { API_URL } from './config.js';

// Exportamos la función para poder llamarla desde auth.js tras un login exitoso
export async function fetchOrders() {
    const tableBody = document.getElementById('ordersTableBody');
    tableBody.innerHTML = '<tr><td colspan="6">Cargando pedidos...</td></tr>';

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Error al obtener los datos');

        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        tableBody.innerHTML = '<tr><td colspan="6" style="color: red;">Error al cargar los datos.</td></tr>';
    }
}

function renderTable(orders) {
    const tableBody = document.getElementById('ordersTableBody');
    tableBody.innerHTML = ''; // Limpiar la tabla

    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No hay pedidos registrados.</td></tr>';
        return;
    }

    // Iterar sobre los datos e inyectarlos en el HTML
    orders.forEach(order => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${order.Fecha || 'N/A'}</td>
            <td>${order.Nombre || 'N/A'}</td>
            <td>${order.Direccion || 'N/A'}</td>
            <td>${order.Telefono || 'N/A'}</td>
            <td>${order.Producto || 'N/A'}</td>
            <td>${order.Cantidad || 'N/A'}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Evento para el botón de actualizar manualmente
document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchOrders);
    }
});