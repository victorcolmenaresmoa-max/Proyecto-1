import { API_PRODUCTOS } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('catalogoContenedor');

    try {
        const response = await fetch(API_PRODUCTOS);
        const productos = await response.json();
        
        contenedor.innerHTML = ''; // Limpiar el "Cargando"

        // Filtrar productos que tengan stock > 0
        const productosDisponibles = productos.filter(p => parseInt(p.Stock) > 0);

        productosDisponibles.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${prod.Imagen}" alt="${prod.Nombre}" onerror="this.src='https://via.placeholder.com/200?text=Sin+Imagen'">
                <h3>${prod.Nombre}</h3>
                <p class="price">US$ ${prod.Precio}</p>
                <p style="color: green; font-size: 12px;">Envío gratis</p>
                <a href="checkout.html?producto=${encodeURIComponent(prod.Nombre)}&precio=${prod.Precio}" class="btn-comprar">Comprar ahora</a>
            `;
            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error('Error cargando productos:', error);
        contenedor.innerHTML = '<p>Error al cargar el catálogo.</p>';
    }
});