const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 200
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  }
}, {
  timestamps: true
});

// Middleware to update post's comment count when a comment is added
commentSchema.post('save', async function() {
  const Post = mongoose.model('Post');
  await Post.findByIdAndUpdate(
    this.post,
    { $inc: { commentsCount: 1 } }
  );
});

// Middleware to update post's comment count when a comment is deleted
commentSchema.post('remove', async function() {
  const Post = mongoose.model('Post');
  await Post.findByIdAndUpdate(
    this.post,
    { $inc: { commentsCount: -1 } }
  );
});

module.exports = mongoose.model('Comment', commentSchema);
