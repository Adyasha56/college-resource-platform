import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Add comment to a post
// @route   POST /api/posts/:postId/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId).populate('author', 'name');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user.id,
      content
    });

    // Increment comment count on post
    post.commentCount += 1;
    await post.save();

    // Create notification for post author (if not commenting on own post)
    if (post.author._id.toString() !== req.user.id) {
      const sender = await User.findById(req.user.id).select('name');
      
      await Notification.create({
        recipient: post.author._id,
        sender: req.user.id,
        type: 'comment',
        post: postId,
        comment: comment._id,
        message: `${sender.name} commented on your post "${post.title.substring(0, 30)}${post.title.length > 30 ? '...' : ''}"`
      });
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name avatar')
      .lean();

    res.status(201).json({
      success: true,
      comment: { ...populatedComment, isLiked: false }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private (own comment only)
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check ownership
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this comment' });
    }

    const { content } = req.body;
    comment.content = content;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('author', 'name avatar')
      .lean();

    res.json({
      success: true,
      comment: {
        ...updatedComment,
        isLiked: updatedComment.likedBy.some(id => id.toString() === req.user.id)
      }
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (own comment only)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check ownership
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    // Decrement comment count on post
    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentCount: -1 }
    });

    // Delete notification for this comment
    await Notification.deleteMany({ comment: comment._id });

    await comment.deleteOne();

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle like on a comment
// @route   POST /api/comments/:id/like
// @access  Private
export const toggleCommentLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const userId = req.user.id;
    const likedIndex = comment.likedBy.findIndex(id => id.toString() === userId);

    if (likedIndex > -1) {
      // Unlike
      comment.likedBy.splice(likedIndex, 1);
      comment.likeCount = Math.max(0, comment.likeCount - 1);
    } else {
      // Like
      comment.likedBy.push(userId);
      comment.likeCount += 1;
    }

    await comment.save();

    res.json({
      success: true,
      likeCount: comment.likeCount,
      isLiked: likedIndex === -1
    });
  } catch (error) {
    console.error('Toggle comment like error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
