// Feed page functionality
let currentUser = null;
let posts = [];
let selectedMedia = [];

// Dummy Posts Data with Photos
const dummyPosts = [
    { 
        id: 1, 
        userId: 1, 
        content: 'Just had an amazing coffee at the new cafe downtown! ☕', 
        likes: 12, 
        timestamp: new Date('2024-06-13T10:30:00'),
        media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=300&fit=crop' }]
    },
    { 
        id: 2, 
        userId: 2, 
        content: 'Working on a new project today. Excited to share the results soon! 🚀', 
        likes: 8, 
        timestamp: new Date('2024-06-13T09:15:00'),
        media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=300&fit=crop' }]
    },
    { 
        id: 3, 
        userId: 3, 
        content: 'Beautiful sunset view from my balcony tonight 🌅', 
        likes: 25, 
        timestamp: new Date('2024-06-12T19:45:00'),
        media: []
    },
    { 
        id: 4, 
        userId: 4, 
        content: 'Just finished reading an incredible book on artificial intelligence. Highly recommend it!', 
        likes: 15, 
        timestamp: new Date('2024-06-12T16:20:00'),
        media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=300&fit=crop' }]
    }
];

const dummyUsers = [
    { id: 1, name: 'Alice Johnson', username: 'alice_j', email: 'alice@example.com', followers: 25, following: 18, posts: 5 },
    { id: 2, name: 'Bob Smith', username: 'bob_smith', email: 'bob@example.com', followers: 42, following: 33, posts: 8 },
    { id: 3, name: 'Carol Davis', username: 'carol_d', email: 'carol@example.com', followers: 67, following: 21, posts: 12 },
    { id: 4, name: 'David Wilson', username: 'david_w', email: 'david@example.com', followers: 89, following: 45, posts: 15 }
];

// Replace your dummy fetch with this:
fetch('http://localhost:5000/api/posts')
  .then(res => res.json())
  .then(data => {
    posts = data;
    loadFeed();
  });



// Initialize
document.addEventListener('DOMContentLoaded', function() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    posts = [...dummyPosts];
    initializeEventListeners();
    loadTheme();
    loadFeed();
});

function initializeEventListeners() {
    document.getElementById('post-btn').addEventListener('click', createPost);
    document.getElementById('photo-btn').addEventListener('click', () => selectMedia('image/*'));
    document.getElementById('video-btn').addEventListener('click', () => selectMedia('video/*'));
    document.getElementById('media-input').addEventListener('change', handleMediaSelect);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('logout-btn').addEventListener('click', logout);
}

function selectMedia(accept) {
    const input = document.getElementById('media-input');
    input.accept = accept;
    input.click();
}

function handleMediaSelect(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (selectedMedia.length < 4) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const mediaItem = {
                    type: file.type.startsWith('image/') ? 'image' : 'video',
                    url: event.target.result,
                    file: file
                };
                selectedMedia.push(mediaItem);
                updateMediaPreview();
            };
            reader.readAsDataURL(file);
        }
    });
    e.target.value = '';
}

function updateMediaPreview() {
    const preview = document.getElementById('media-preview');
    preview.innerHTML = '';
    
    selectedMedia.forEach((media, index) => {
        const mediaDiv = document.createElement('div');
        mediaDiv.className = 'media-item';
        
        if (media.type === 'image') {
            mediaDiv.innerHTML = `
                <img src="${media.url}" alt="Preview">
                <button class="media-remove" onclick="removeMedia(${index})">×</button>
            `;
        } else {
            mediaDiv.innerHTML = `
                <video src="${media.url}" controls>
                    Your browser does not support the video tag.
                </video>
                <button class="media-remove" onclick="removeMedia(${index})">×</button>
            `;
        }
        
        preview.appendChild(mediaDiv);
    });
}

function removeMedia(index) {
    selectedMedia.splice(index, 1);
    updateMediaPreview();
}

async function createPost() {
    const content = document.getElementById('post-content').value.trim();
    if (!content && selectedMedia.length === 0) return;

    const newPost = {
        userId: currentUser._id, // from backend _id
        content: content,
        media: selectedMedia.map(m => ({ type: m.type, url: m.url }))
    };

    const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
    });

    const savedPost = await res.json();
    posts.unshift(savedPost);
    document.getElementById('post-content').value = '';
    selectedMedia = [];
    updateMediaPreview();
    loadFeed();
}


function loadFeed() {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = createPostElement(post);
        container.appendChild(postElement);
    });
}

function createPostElement(post) {
    const user = post.userId === 0 ? currentUser : dummyUsers.find(u => u.id === post.userId);
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
                <h4>${user.name}</h4>
                <span>@${user.username} • ${formatDate(post.timestamp)}</span>
            </div>
        </div>
        <div class="post-content">${post.content}</div>
        ${mediaHTML}
        <div class="post-actions">
            <button class="post-action like-btn" data-post-id="${post.id}">
                ❤️ ${post.likes}
            </button>
            <button class="post-action">💬 Comment</button>
            <button class="post-action">🔄 Share</button>
        </div>
    `;
    
    const likeBtn = postDiv.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => toggleLike(post.id));
    
    return postDiv;
}

function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes++;
        loadFeed();
    }
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
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
}

