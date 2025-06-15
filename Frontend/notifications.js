// Notifications page functionality
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    initializeEventListeners();
    loadTheme();
    loadNotifications();
});

function initializeEventListeners() {
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('logout-btn').addEventListener('click', logout);
}

function loadNotifications() {
    const container = document.getElementById('notifications-list');
    container.innerHTML = `
        <div style="text-align: center; color: var(--text-secondary); padding: 2rem;">
            <h3>Stay tuned!</h3>
            <p>Notifications will appear here when other users interact with your posts.</p>
        </div>
    `;
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    document.getElementById('theme-toggle').textContent = newTheme === 'light' ? '🌙' : '☀️';
    localStorage.setItem('theme', newTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('theme-toggle').textContent = savedTheme === 'light' ? '🌙' : '☀️';
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}
