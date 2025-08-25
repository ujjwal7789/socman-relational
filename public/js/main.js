// public/js/main.js
function logout() {
    // Clear the token cookie by setting its expiration date to the past
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = '/login';
}