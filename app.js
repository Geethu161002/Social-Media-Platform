class App {
    constructor() {
        this.setupDOMElements();
        this.setupEventListeners();
        this.checkAuth();
    }

    setupDOMElements() {
        // Auth sections
        this.authForms = document.getElementById('authForms');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        
        // Main sections
        this.feedSection = document.getElementById('feedSection');
        this.profileSection = document.getElementById('profileSection');
        
        // Navigation
        this.homeLink = document.getElementById('homeLink');
        this.profileLink = document.getElementById('profileLink');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        // Post creation
        this.createPostBtn = document.getElementById('createPostBtn');
        this.postContent = document.getElementById('postContent');
        this.postsList = document.getElementById('postsList');
    }

    setupEventListeners() {
        // Auth tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchAuthTab(tab.dataset.tab));
        });

        // Auth forms
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        
        // Navigation
        this.homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showFeed();
        });
        
        this.profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showProfile();
        });
        
        this.logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Post creation
        this.createPostBtn.addEventListener('click', () => this.handleCreatePost());
    }

    checkAuth() {
        if (auth.isAuthenticated()) {
            this.showFeed();
            this.loadFeed();
        } else {
            this.showAuth();
        }
    }

    switchAuthTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        
        this.loginForm.classList.toggle('hidden', tab !== 'login');
        this.registerForm.classList.toggle('hidden', tab !== 'register');
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;

        const result = await auth.login(email, password);
        if (result.success) {
            this.showFeed();
            this.loadFeed();
        } else {
            alert(result.message);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const username = e.target.querySelector('input[type="text"]').value;
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;

        const result = await auth.register(username, email, password);
        if (result.success) {
            this.showFeed();
            this.loadFeed();
        } else {
            alert(result.message);
        }
    }

    handleLogout() {
        auth.logout();
        this.showAuth();
    }

    async handleCreatePost() {
        const content = this.postContent.value.trim();
        if (!content) return;

        const result = await posts.createPost(content);
        if (result.success) {
            this.postContent.value = '';
            this.loadFeed();
        } else {
            alert('Failed to create post');
        }
    }

    async loadFeed() {
        const result = await posts.getFeed();
        if (result.success) {
            this.postsList.innerHTML = '';
            result.data.posts.forEach(post => {
                const postElement = posts.createPostElement(post);
                this.postsList.appendChild(postElement);
            });
        }
    }

    showAuth() {
        this.authForms.classList.remove('hidden');
        this.feedSection.classList.add('hidden');
        this.profileSection.classList.add('hidden');
    }

    showFeed() {
        this.authForms.classList.add('hidden');
        this.feedSection.classList.remove('hidden');
        this.profileSection.classList.add('hidden');
    }

    showProfile() {
        this.authForms.classList.add('hidden');
        this.feedSection.classList.add('hidden');
        this.profileSection.classList.remove('hidden');
        profile.loadCurrentUserProfile();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
