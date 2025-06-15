// Search page functionality
let currentUser = null;
let followingList = [];

const dummyUsers = [
    { id: 1, name: 'Alice Johnson', username: 'alice_j', email: 'alice@example.com', followers: 25, following: 18, posts: 5 },
    { id: 2, name: 'Bob Smith', username: 'bob_smith', email: 'bob@example.com', followers: 42, following: 33, posts: 8 },
    { id: 3, name: 'Carol Davis', username: 'carol_d', email: 'carol@example.com', followers: 67, following: 21, posts: 12 },
    { id: 4, name: 'David Wilson', username: 'david_w', email: 'david@example.com', followers: 89, following: 45, posts: 15 },
    { id: 5, name: 'Emma Brown', username: 'emma_b', email: 'emma@example.com', followers: 156, following: 78, posts: 22 },
    { id: 6, name: 'Frank Miller', username: 'frank_m', email: 'frank@example.com', followers: 201, following: 92, posts: 18 },
    { id: 7, name: 'Grace Taylor', username: 'grace_t', email: 'grace@example.com', followers: 334, following: 167, posts: 31 }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    followingList = JSON.parse(localStorage.getItem('followingList') || '[]');
    initializeEventListeners();
    loadTheme();
    loadAllUsers();
});

function initializeEventListeners() {
    document.getElementById('search-btn').addEventListener('click', searchUsers);
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchUsers();
    });
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('logout-btn').addEventListener('click', logout);
}

function searchUsers() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const results = dummyUsers.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.username.toLowerCase().includes(query)
    );
    
    displaySearchResults(results);
}

function loadAllUsers() {
    displaySearchResults(dummyUsers);
}

function displaySearchResults(userList) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';
    
    userList.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        
        const isFollowing = followingList.includes(user.id);
        
        userCard.innerHTML = `
            <div class="user-info">
                <div class="post-avatar">👤</div>
                <div>
                    <h4>${user.name}</h4>
                    <p>@${user.username}</p>
                    <small>${user.followers} followers</small>
                </div>
            </div>
            <button class="follow-btn ${isFollowing ? 'following' : ''}" data-user-id="${user.id}">
                ${isFollowing ? 'Following' : 'Follow'}
            </button>
        `;
        
        const followBtn = userCard.querySelector('.follow-btn');
        followBtn.addEventListener('click', () => toggleFollow(user.id));
        
        container.appendChild(userCard);
    });
}

function toggleFollow(userId) {
    const user = dummyUsers.find(u => u.id === userId);
    const isFollowing = followingList.includes(userId);
    
    if (isFollowing) {
        followingList = followingList.filter(id => id !== userId);
        user.followers--;
    } else {
        followingList.push(userId);
        user.followers++;
    }
    
    localStorage.setItem('followingList', JSON.stringify(followingList));
    loadAllUsers();
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