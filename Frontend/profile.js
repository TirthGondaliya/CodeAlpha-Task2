// Profile page functionality
let currentUser = null;
let posts = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    initializeEventListeners();
    loadTheme();
    updateProfile();
    loadUserPosts();
});

function initializeEventListeners() {
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('logout-btn').addEventListener('click', logout);
}

function updateProfile() {
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-username').textContent = '@' + currentUser.username;
    document.getElementById('profile-posts').textContent = currentUser.posts;
    document.getElementById('profile-followers').textContent = currentUser.followers;
    const followingList = JSON.parse(localStorage.getItem('followingList') || '[]');
    document.getElementById('profile-following').textContent = followingList.length;
}

function loadUserPosts() {
    const container = document.getElementById('user-posts');
    container.innerHTML = '';
    
    // Load posts from localStorage or show empty state
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const userPosts = allPosts.filter(post => post.userId === 0);
    
    if (userPosts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); margin-top: 2rem;">No posts yet. Start sharing your thoughts!</p>';
        return;
    }
    
    userPosts.forEach(post => {
        const postElement = createPostElement(post);
        container.appendChild(postElement);
    });
}

function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    
    let mediaHTML = '';
    if (post.media && post.media.length > 0) {
        const gridClass = `grid-${Math.min(post.media.length, 4)}`;
        mediaHTML = `<div class="post-media media-grid ${gridClass}">`;
        
        post.media.slice(0, 4).forEach(media => {
            if (media.type === 'image') {
                mediaHTML += `<div class="media-item"><img src="${media.url}" alt="Post image"></div>`;
            } else {
                mediaHTML += `<div class="media-item"><video src="${media.url}" controls></video></div>`;
            }
        });
        
        mediaHTML += '</div>';
    }
    
    postDiv.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">👤</div>
            <div class="post-user">
                <h4>${currentUser.name}</h4>
                <span>@${currentUser.username} • ${formatDate(post.timestamp)}</span>
            </div>
        </div>
        <div class="post-content">${post.content}</div>
        ${mediaHTML}
        <div class="post-actions">
            <button class="post-action">❤️ ${post.likes}</button>
            <button class="post-action">💬 Comment</button>
            <button class="post-action">🔄 Share</button>
        </div>
    `;
    
    return postDiv;
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

function formatDate(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
}