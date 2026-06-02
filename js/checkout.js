import { API_PEDIDOS } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Extraer qué producto seleccionó el usuario de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const nombreProducto = urlParams.get('producto');
    const precioProducto = urlParams.get('precio');

    // Pre-llenar la interfaz
    if(nombreProducto) {
        document.getElementById('displayProducto').textContent = nombreProducto;
        document.getElementById('producto').value = nombreProducto;
        document.getElementById('displayPrecio').textContent = precioProducto;
    } else {
        alert("No se ha seleccionado ningún producto.");
        window.location.href = 'index.html'; // Lo devolvemos al catálogo
    }

    const form = document.getElementById('checkoutForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando...';

        const orderData = {
            Nombre: document.getElementById('nombre').value,
            Direccion: document.getElementById('direccion').value,
            Telefono: document.getElementById('telefono').value,
            Producto: document.getElementById('producto').value,
            Cantidad: document.getElementById('cantidad').value,
            Fecha: new Date().toLocaleDateString()
        };

        try {
            // Nota: Configura tu SheetDB para que entienda a qué hoja va este POST, 
            // o mándalo al endpoint general si SheetDB enruta por defecto a "Pedidos".
            const response = await fetch(API_PEDIDOS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: [orderData] })
            });

            if (response.ok) {
                alert('¡Pedido realizado con éxito!');
                window.location.href = 'index.html'; // Redirigir al inicio
            } else {
                throw new Error('Error al procesar');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema. Intenta de nuevo.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirmar y Comprar';
        }
    });
});