import { API_PEDIDOS } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener datos de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const nombreProducto = urlParams.get('producto');
    // Convertimos el precio a número. Si falla, ponemos 0.
    const precioProducto = parseFloat(urlParams.get('precio')) || 0; 

    // 2. Capturar los elementos del HTML
    const displayProducto = document.getElementById('displayProducto');
    const displayPrecio = document.getElementById('displayPrecio');
    const inputProducto = document.getElementById('producto'); // Input oculto
    const inputCantidad = document.getElementById('cantidad');

    // 3. Validar si llegaron datos por la URL e inyectarlos
    if (nombreProducto) {
        displayProducto.textContent = nombreProducto;
        inputProducto.value = nombreProducto;
        displayPrecio.textContent = precioProducto.toFixed(2); // Muestra 2 decimales
    } else {
        console.error("No se encontraron los parámetros 'producto' ni 'precio' en la URL.");
    }

    // 4. BONUS SENIOR: Actualizar el total si el usuario cambia la cantidad
    if (inputCantidad) {
        inputCantidad.addEventListener('input', () => {
            const cantidadPedida = parseInt(inputCantidad.value) || 1;
            const totalCalculado = precioProducto * cantidadPedida;
            displayPrecio.textContent = totalCalculado.toFixed(2);
        });
    }

    // 5. Lógica para enviar el pedido al servidor
    const form = document.getElementById('checkoutForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando pedido...';

        // Estructurar los datos (Deben coincidir EXACTAMENTE con las columnas de Sheets)
        const orderData = {
            Fecha: new Date().toLocaleDateString(),
            Nombre: document.getElementById('nombre').value,
            Direccion: document.getElementById('direccion').value,
            Telefono: document.getElementById('telefono').value,
            Producto: inputProducto.value,
            Cantidad: inputCantidad.value
        };

        console.log("Intentando enviar este pedido a la base de datos:", orderData);

        try {
            const response = await fetch(API_PEDIDOS, {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ data: [orderData] })
            });

            if (response.ok) {
                alert('¡Pedido realizado con éxito!');
                window.location.href = 'index.html'; // Devuelve al cliente a la tienda
            } else {
                // Si SheetDB rechaza la petición, atrapamos el error para leerlo
                const errorData = await response.json();
                console.error("El servidor respondió con un error:", errorData);
                throw new Error('Fallo al guardar en la base de datos');
            }
        } catch (error) {
            console.error('Error fatal al enviar el pedido:', error);
            alert('Hubo un problema al procesar tu compra. Por favor, intenta de nuevo.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirmar y Comprar';
        }
    });
});
