import { API_PEDIDOS } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener datos de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const nombreProducto = urlParams.get('producto');
    const precioProducto = parseFloat(urlParams.get('precio')) || 0; 
    const imagenProducto = urlParams.get('imagen');
    const descProducto = urlParams.get('desc');

    // 2. Capturar los elementos del HTML
    const displayProducto = document.getElementById('displayProducto');
    const displayPrecio = document.getElementById('displayPrecio');
    const displayImagen = document.getElementById('summaryImagen');
    const displayDesc = document.getElementById('displayDesc');
    const inputProducto = document.getElementById('producto'); 
    const inputCantidad = document.getElementById('cantidad');

    // 3. Inyectar datos en la pantalla
    if (nombreProducto) {
        displayProducto.textContent = nombreProducto;
        inputProducto.value = nombreProducto;
        displayPrecio.textContent = precioProducto.toFixed(2);
        
        // Inyectamos la imagen y la descripción
        if(imagenProducto) displayImagen.src = imagenProducto;
        if(descProducto) displayDesc.textContent = descProducto;
        else displayDesc.textContent = "Sin descripción detallada.";
    } else {
        window.location.href = 'index.html'; // Si entran sin producto, los devolvemos a la tienda
    }

    // 4. Actualizar el total si cambian la cantidad
    if (inputCantidad) {
        inputCantidad.addEventListener('input', () => {
            const cantidadPedida = parseInt(inputCantidad.value) || 1;
            const totalCalculado = precioProducto * cantidadPedida;
            displayPrecio.textContent = totalCalculado.toFixed(2);
        });
    }

    // 5. Lógica para enviar el pedido a Google Sheets
    const form = document.getElementById('checkoutForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando tu pedido...';

        const orderData = {
            Fecha: new Date().toLocaleDateString(),
            Nombre: document.getElementById('nombre').value,
            Direccion: document.getElementById('direccion').value,
            Telefono: document.getElementById('telefono').value,
            Producto: inputProducto.value,
            Cantidad: inputCantidad.value
        };

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
                alert('¡Felicidades! Pedido realizado con éxito.');
                window.location.href = 'index.html';
            } else {
                throw new Error('Fallo en el servidor');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un problema. Por favor, intenta de nuevo.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirmar y Pagar';
        }
    });
});
