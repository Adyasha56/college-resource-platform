import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all posts with filters and sorting
// @route   GET /api/posts
// @access  Private
export const getPosts = async (req, res) => {
  try {
    const { 
      type, 
      sort = 'recent', 
      year, 
      branch,
      page = 1, 
      limit = 10 
    } = req.query;

    // Build filter query
    const filter = {};
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (year) {
      filter.authorYear = parseInt(year);
    }
    
    if (branch) {
      filter.authorBranch = branch;
    }

    // Build sort query
    let sortQuery = {};
    switch (sort) {
      case 'popular':
        sortQuery = { likeCount: -1, createdAt: -1 };
        break;
      case 'recent':
      default:
        sortQuery = { createdAt: -1 };
        break;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name avatar year branch')
      .lean();

    const total = await Post.countDocuments(filter);

    // Add isLiked flag for current user
    const postsWithLikeStatus = posts.map(post => ({
      ...post,
      isLiked: post.likedBy.some(id => id.toString() === req.user.id)
    }));

    res.json({
      success: true,
      posts: postsWithLikeStatus,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single post with comments
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar year branch')
      .lean();

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: 1 })
      .populate('author', 'name avatar')
      .lean();

    // Add isLiked flags
    const postWithLikeStatus = {
      ...post,
      isLiked: post.likedBy.some(id => id.toString() === req.user.id)
    };

    const commentsWithLikeStatus = comments.map(comment => ({
      ...comment,
      isLiked: comment.likedBy.some(id => id.toString() === req.user.id)
    }));

    res.json({
      success: true,
      post: postWithLikeStatus,
      comments: commentsWithLikeStatus
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { type, title, content, link, images } = req.body;

    // Get user info for denormalized fields
    const user = await User.findById(req.user.id).select('year branch');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const post = await Post.create({
      author: req.user.id,
      type,
      title,
      content,
      link: link || undefined,
      images: images || [],
      authorYear: user.year,
      authorBranch: user.branch
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name avatar year branch')
      .lean();

    res.status(201).json({
      success: true,
      post: { ...populatedPost, isLiked: false }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (own post only)
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this post' });
    }

    const { title, content, link, images, isResolved } = req.body;

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (link !== undefined) post.link = link;
    if (images) post.images = images;
    if (typeof isResolved === 'boolean') post.isResolved = isResolved;

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name avatar year branch')
      .lean();

    res.json({
      success: true,
      post: {
        ...updatedPost,
        isLiked: updatedPost.likedBy.some(id => id.toString() === req.user.id)
      }
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (own post only)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    // Delete images from Cloudinary
    for (const image of post.images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    // Delete all comments for this post
    await Comment.deleteMany({ post: post._id });

    // Delete all notifications for this post
    await Notification.deleteMany({ post: post._id });

    await post.deleteOne();

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle like on a post
// @route   POST /api/posts/:id/like
// @access  Private
export const togglePostLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userId = req.user.id;
    const likedIndex = post.likedBy.findIndex(id => id.toString() === userId);

    if (likedIndex > -1) {
      // Unlike
      post.likedBy.splice(likedIndex, 1);
      post.likeCount = Math.max(0, post.likeCount - 1);
    } else {
      // Like
      post.likedBy.push(userId);
      post.likeCount += 1;
    }

    await post.save();

    res.json({
      success: true,
      likeCount: post.likeCount,
      isLiked: likedIndex === -1 // Now liked if wasn't before
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Upload images for a post
// @route   POST /api/posts/upload
// @access  Private
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const images = req.files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));

    res.json({ success: true, images });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
