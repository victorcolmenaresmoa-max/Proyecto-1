// js/admin.js

// 1. Las importaciones siempre deben ir en las primeras líneas del archivo
import { API_URL, API_PRODUCTOS } from './config.js';

// ==========================================
// LÓGICA DE PEDIDOS (GET)
// ==========================================
export async function fetchOrders() {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;
    
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
    tableBody.innerHTML = ''; 

    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No hay pedidos registrados.</td></tr>';
        return;
    }

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

// ==========================================
// AQUÍ SE AGREGA LA LÓGICA DE STOCK (POST)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el botón de actualizar pedidos
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchOrders);
    }

    // Escuchar el evento de envío del formulario de stock
    const stockForm = document.getElementById('stockForm');
    if (stockForm) {
        stockForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            btn.disabled = true;
            btn.textContent = 'Guardando...';

            const nuevoProducto = {
                ID: Date.now(), 
                Nombre: document.getElementById('prodNombre').value,
                Precio: document.getElementById('prodPrecio').value,
                Imagen: document.getElementById('prodImagen').value,
                Stock: document.getElementById('prodStock').value
            };

            try {
                const response = await fetch(API_PRODUCTOS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: [nuevoProducto] })
                });

                if (response.ok) {
                    alert('Producto agregado al catálogo exitosamente.');
                    e.target.reset();
                } else {
                    throw new Error('Error en el servidor');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al guardar el producto.');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Guardar Producto';
            }
        });
    }
});