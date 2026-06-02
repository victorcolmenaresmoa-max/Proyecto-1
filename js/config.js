// 1. Coloca aquí tu ID de SheetDB
const API_BASE = 'https://sheetdb.io/api/v1/0ezp3ubwo2fuz'; 

// 2. Exportamos las rutas exactas para cada archivo
export const API_URL = `${API_BASE}?sheet=Pedidos`;         // Lo usa admin.js para leer
export const API_PEDIDOS = `${API_BASE}?sheet=Pedidos`;     // Lo usa checkout.js para guardar
export const API_PRODUCTOS = `${API_BASE}?sheet=Productos`; // Lo usa catalogo.js y admin.js
