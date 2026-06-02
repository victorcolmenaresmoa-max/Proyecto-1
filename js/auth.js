import { fetchOrders } from './admin.js';

// Contraseña estática (Hardcoded)
const ADMIN_PASSWORD = 'supersecreto123';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const passwordInput = document.getElementById('adminPassword');
    const loginError = document.getElementById('loginError');
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');

    // Verificar si ya hay una sesión activa (ej. sessionStorage)
    if (sessionStorage.getItem('isAuthenticated') === 'true') {
        showDashboard();
    }

    loginBtn.addEventListener('click', () => {
        if (passwordInput.value === ADMIN_PASSWORD) {
            sessionStorage.setItem('isAuthenticated', 'true');
            showDashboard();
        } else {
            loginError.style.display = 'block';
            passwordInput.value = '';
        }
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAuthenticated');
        loginSection.style.display = 'block';
        dashboardSection.style.display = 'none';
        passwordInput.value = '';
    });

    function showDashboard() {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        loginError.style.display = 'none';
        // Llamar a la función que trae los datos al autenticarse
        fetchOrders();
    }
});