class Posts {
    constructor() {
        this.baseURL = '/api';
    }

    async createPost(content) {
        try {
            const response = await fetch(`${this.baseURL}/posts`, {
                method: 'POST',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify({ content })
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    }

    async getFeed(page = 1) {
        try {
            const response = await fetch(`${this.baseURL}/posts/feed?page=${page}`, {
                headers: auth.getAuthHeaders()
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    }

    async likePost(postId) {
        try {
            const response = await fetch(`${this.baseURL}/posts/${postId}/like`, {
                method: 'POST',
                headers: auth.getAuthHeaders()
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    }

    async getComments(postId) {
        try {
            const response = await fetch(`${this.baseURL}/comments/post/${postId}`, {
                headers: auth.getAuthHeaders()
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    }

    async addComment(postId, content) {
        try {
            const response = await fetch(`${this.baseURL}/comments`, {
                method: 'POST',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify({ postId, content })
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    }

    async deletePost(postId) {
        try {
            const response = await fetch(`${this.baseURL}/posts/${postId}`, {
                method: 'DELETE',
                headers: auth.getAuthHeaders()
            });

            return { success: response.ok };
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    }

    createPostElement(post) {
        const isOwnPost = post.author._id === auth.user.id;
        const isLiked = post.likes.some(like => like._id === auth.user.id);
        
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.dataset.postId = post._id;
        
        postElement.innerHTML = `
            <div class="post-header">
                <span class="post-author">${post.author.username}</span>
                ${isOwnPost ? '<button class="delete-post-btn"><i class="fas fa-trash"></i></button>' : ''}
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <button class="like-btn ${isLiked ? 'liked' : ''}">
                    <i class="fas fa-heart"></i>
                    <span class="likes-count">${post.likesCount}</span>
                </button>
                <button class="comment-btn">
                    <i class="fas fa-comment"></i>
                    <span class="comments-count">${post.commentsCount}</span>
                </button>
            </div>
        `;

        // Add event listeners
        const likeBtn = postElement.querySelector('.like-btn');
        const commentBtn = postElement.querySelector('.comment-btn');
        const deleteBtn = postElement.querySelector('.delete-post-btn');

        likeBtn?.addEventListener('click', () => this.handleLike(post._id));
        commentBtn?.addEventListener('click', () => this.handleCommentClick(post._id));
        deleteBtn?.addEventListener('click', () => this.handleDelete(post._id));

        return postElement;
    }

    async handleLike(postId) {
        const result = await this.likePost(postId);
        if (result.success) {
            const postElement = document.querySelector(`[data-post-id="${postId}"]`);
            const likeBtn = postElement.querySelector('.like-btn');
            const likesCount = postElement.querySelector('.likes-count');
            
            likeBtn.classList.toggle('liked');
            likesCount.textContent = result.data.post.likesCount;
        }
    }

    async handleCommentClick(postId) {
        const modal = document.getElementById('commentsModal');
        const commentsList = document.getElementById('commentsList');
        const commentForm = document.getElementById('commentForm');
        
        // Clear previous comments
        commentsList.innerHTML = '';
        
        // Load comments
        const result = await this.getComments(postId);
        if (result.success) {
            result.data.comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <strong>${comment.author.username}:</strong>
                    ${comment.content}
                `;
                commentsList.appendChild(commentElement);
            });
        }

        // Set up comment form
        commentForm.onsubmit = async (e) => {
            e.preventDefault();
            const content = e.target.querySelector('input').value;
            const result = await this.addComment(postId, content);
            
            if (result.success) {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <strong>${auth.user.username}:</strong>
                    ${content}
                `;
                commentsList.appendChild(commentElement);
                e.target.reset();

                // Update comment count
                const postElement = document.querySelector(`[data-post-id="${postId}"]`);
                const commentsCount = postElement.querySelector('.comments-count');
                commentsCount.textContent = parseInt(commentsCount.textContent) + 1;
            }
        };

        modal.classList.remove('hidden');
    }

    async handleDelete(postId) {
        if (confirm('Are you sure you want to delete this post?')) {
            const result = await this.deletePost(postId);
            if (result.success) {
                const postElement = document.querySelector(`[data-post-id="${postId}"]`);
                postElement.remove();
            }
        }
    }
}

// Initialize posts instance
const posts = new Posts();

// Set up modal close button
document.querySelector('.close-modal')?.addEventListener('click', () => {
    document.getElementById('commentsModal').classList.add('hidden');
});
