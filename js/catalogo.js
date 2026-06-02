import { API_PRODUCTOS } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('catalogoContenedor');
    const buscador = document.getElementById('buscador'); // Capturamos la barra de búsqueda
    let todosLosProductos = []; // Guardamos los productos aquí para poder filtrarlos

    try {
        const response = await fetch(API_PRODUCTOS);
        todosLosProductos = await response.json();
        
        // Al cargar, mostramos solo los que tienen stock
        const productosDisponibles = todosLosProductos.filter(p => parseInt(p.Stock) > 0);
        renderizarProductos(productosDisponibles);

    } catch (error) {
        console.error('Error cargando productos:', error);
        contenedor.innerHTML = '<p class="loading-text">Error al cargar el catálogo.</p>';
    }

    // ==========================================
    // LÓGICA DEL BUSCADOR EN TIEMPO REAL
    // ==========================================
    if (buscador) {
        buscador.addEventListener('input', (e) => {
            const textoBusqueda = e.target.value.toLowerCase();
            
            // Filtramos los productos que coincidan con lo que escribe el cliente
            const productosFiltrados = todosLosProductos.filter(p => 
                parseInt(p.Stock) > 0 && 
                p.Nombre.toLowerCase().includes(textoBusqueda)
            );
            
            renderizarProductos(productosFiltrados);
        });
    }

    // ==========================================
    // FUNCIÓN PARA PINTAR LAS TARJETAS (CORREGIDA)
    // ==========================================
    function renderizarProductos(productos) {
        contenedor.innerHTML = ''; // Limpiar el contenedor

        if (productos.length === 0) {
            contenedor.innerHTML = '<p class="loading-text">No se encontraron productos.</p>';
            return;
        }

        productos.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Ahora la estructura html (.card-info) se crea correctamente aquí
            card.innerHTML = `
                <img src="${prod.Imagen}" alt="${prod.Nombre}" onerror="this.src='https://via.placeholder.com/200?text=Sin+Imagen'">
                <div class="card-info">
                    <h3>${prod.Nombre}</h3>
                    <p class="price">US$ ${prod.Precio}</p>
                    <p style="color: green; font-size: 12px;">Envío gratis</p>
                    <a href="checkout.html?producto=${encodeURIComponent(prod.Nombre)}&precio=${prod.Precio}&imagen=${encodeURIComponent(prod.Imagen)}&desc=${encodeURIComponent(prod.Descripcion || '')}" class="btn-comprar">Comprar ahora</a>                </div>
            `;
            contenedor.appendChild(card);
        });
    }
});
