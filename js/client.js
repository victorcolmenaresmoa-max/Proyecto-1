import { API_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Deshabilitar botón para evitar envíos dobles
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        // Estructurar los datos (Los nombres de las claves deben coincidir con las columnas en Google Sheets)
        const orderData = {
            Nombre: document.getElementById('nombre').value,
            Direccion: document.getElementById('direccion').value,
            Telefono: document.getElementById('telefono').value,
            Producto: document.getElementById('producto').value,
            Cantidad: document.getElementById('cantidad').value,
            Fecha: new Date().toLocaleDateString()
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: [orderData] })
            });

            if (response.ok) {
                alert('Pedido registrado con éxito.');
                form.reset();
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            alert('Hubo un problema al registrar el pedido. Intente de nuevo.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Pedido';
        }
    });
});