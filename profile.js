class Profile {
    constructor() {
        this.baseURL = '/api';
    }

    async getUserProfile(username) {
        try {
            const response = await fetch(`${this.baseURL}/users/${username}`, {
                headers: auth.getAuthHeaders()
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    }

    async updateProfile(bio) {
        try {
            const response = await fetch(`${this.baseURL}/users/profile`, {
                method: 'PUT',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify({ bio })
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    }

    async followUser(userId) {
        try {
            const response = await fetch(`${this.baseURL}/users/follow/${userId}`, {
                method: 'POST',
                headers: auth.getAuthHeaders()
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    }

    async unfollowUser(userId) {
        try {
            const response = await fetch(`${this.baseURL}/users/unfollow/${userId}`, {
                method: 'POST',
                headers: auth.getAuthHeaders()
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    }

    async searchUsers(query) {
        try {
            const response = await fetch(`${this.baseURL}/users/search/${query}`, {
                headers: auth.getAuthHeaders()
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    }

    displayProfile(user, userPosts = []) {
        const profileUsername = document.getElementById('profileUsername');
        const profileBio = document.getElementById('profileBio');
        const postsCount = document.getElementById('postsCount');
        const followersCount = document.getElementById('followersCount');
        const followingCount = document.getElementById('followingCount');
        const userPostsContainer = document.getElementById('userPosts');

        profileUsername.textContent = user.username;
        profileBio.textContent = user.bio || 'No bio available';
        postsCount.textContent = `${user.postsCount} posts`;
        followersCount.textContent = `${user.followers.length} followers`;
        followingCount.textContent = `${user.following.length} following`;

        // Clear previous posts
        userPostsContainer.innerHTML = '';

        // Display user posts
        userPosts.forEach(post => {
            const postElement = posts.createPostElement(post);
            userPostsContainer.appendChild(postElement);
        });
    }

    setupEditProfile() {
        const editBtn = document.getElementById('editProfileBtn');
        const profileBio = document.getElementById('profileBio');

        editBtn.addEventListener('click', () => {
            const currentBio = profileBio.textContent === 'No bio available' ? '' : profileBio.textContent;
            const newBio = prompt('Edit your bio:', currentBio);

            if (newBio !== null) {
                this.updateProfile(newBio).then(result => {
                    if (result.success) {
                        profileBio.textContent = newBio || 'No bio available';
                        auth.user.bio = newBio;
                        localStorage.setItem('user', JSON.stringify(auth.user));
                    } else {
                        alert('Failed to update profile');
                    }
                });
            }
        });
    }

    async loadCurrentUserProfile() {
        if (auth.user) {
            const result = await this.getUserProfile(auth.user.username);
            if (result.success) {
                this.displayProfile(result.data.user, result.data.posts);
            }
        }
    }
}

// Initialize profile instance
const profile = new Profile();
