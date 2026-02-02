import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['discussion', 'question', 'achievement', 'resource', 'project'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    publicId: String
  }],
  link: {
    type: String,
    trim: true
  },
  likeCount: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  commentCount: {
    type: Number,
    default: 0
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  // Denormalized fields for filtering
  authorYear: {
    type: Number
  },
  authorBranch: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
postSchema.index({ createdAt: -1 });
postSchema.index({ likeCount: -1 });
postSchema.index({ type: 1 });
postSchema.index({ authorYear: 1, authorBranch: 1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
