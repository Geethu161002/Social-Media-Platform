const mongoose = require('mongoose');
const User = require('../backend/models/User');
const Post = require('../backend/models/Post');
const Comment = require('../backend/models/Comment');

// Sample data setup script
async function setupSampleData() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/socialmedia', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        await Comment.deleteMany({});

        console.log('Cleared existing data');

        // Create sample users
        const user1 = new User({
            username: 'john_doe',
            email: 'john@example.com',
            password: 'password123',
            bio: 'Software developer and tech enthusiast'
        });

        const user2 = new User({
            username: 'jane_smith',
            email: 'jane@example.com',
            password: 'password123',
            bio: 'Designer and creative thinker'
        });

        await user1.save();
        await user2.save();

        console.log('Created sample users');

        // Create sample posts
        const post1 = new Post({
            content: 'Hello world! This is my first post on this social media platform.',
            author: user1._id
        });

        const post2 = new Post({
            content: 'Beautiful sunset today! Nature never fails to amaze me.',
            author: user2._id
        });

        await post1.save();
        await post2.save();

        // Update user post counts
        await User.findByIdAndUpdate(user1._id, { postsCount: 1 });
        await User.findByIdAndUpdate(user2._id, { postsCount: 1 });

        console.log('Created sample posts');

        // Create sample comments
        const comment1 = new Comment({
            content: 'Welcome to the platform!',
            author: user2._id,
            post: post1._id
        });

        await comment1.save();

        console.log('Created sample comments');
        console.log('Sample data setup complete!');

        process.exit(0);
    } catch (error) {
        console.error('Error setting up sample data:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    setupSampleData();
}

module.exports = setupSampleData;
