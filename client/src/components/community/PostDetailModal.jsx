import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  X,
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  Edit2,
  Trash2,
  Check,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { getPostTypeInfo, getPostTypeBadgeClasses } from "../../utils/postTypeUtils";
import { formatDistanceToNow } from "../../utils/dateUtils";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const PostDetailModal = ({ post: initialPost, onClose, onPostUpdated, onPostDeleted, onLikeToggle }) => {
  const { user } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editPostContent, setEditPostContent] = useState(post.content);

  const typeInfo = getPostTypeInfo(post.type);
  const isOwner = user && post.author?._id === user._id;

  useEffect(() => {
    fetchPostDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post._id]);

  const fetchPostDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setPost(data.post);
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Fetch post error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/posts/${post._id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setPost(prev => ({ ...prev, likeCount: data.likeCount, isLiked: data.isLiked }));
        onLikeToggle(post._id, data.likeCount, data.isLiked);
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/comments/${commentId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setComments(prev =>
          prev.map(c =>
            c._id === commentId
              ? { ...c, likeCount: data.likeCount, isLiked: data.isLiked }
              : c
          )
        );
      }
    } catch (error) {
      console.error("Comment like error:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/posts/${post._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setComments(prev => [...prev, data.comment]);
        setPost(prev => ({ ...prev, commentCount: prev.commentCount + 1 }));
        setNewComment("");
      }
    } catch (error) {
      console.error("Add comment error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editContent.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setComments(prev =>
          prev.map(c => (c._id === commentId ? data.comment : c))
        );
        setEditingComment(null);
      }
    } catch (error) {
      console.error("Edit comment error:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setComments(prev => prev.filter(c => c._id !== commentId));
        setPost(prev => ({ ...prev, commentCount: Math.max(0, prev.commentCount - 1) }));
      }
    } catch (error) {
      console.error("Delete comment error:", error);
    }
  };

  const handleUpdatePost = async () => {
    if (!editTitle.trim() || !editPostContent.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/posts/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editPostContent.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPost(data.post);
        onPostUpdated(data.post);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update post error:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Delete this post? All comments will also be deleted.")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/posts/${post._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        onPostDeleted(post._id);
      }
    } catch (error) {
      console.error("Delete post error:", error);
    }
  };

  const handleMarkResolved = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/posts/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isResolved: !post.isResolved }),
      });

      const data = await res.json();
      if (data.success) {
        setPost(data.post);
        onPostUpdated(data.post);
      }
    } catch (error) {
      console.error("Mark resolved error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <span className={`text-sm px-2 py-0.5 rounded-full ${getPostTypeBadgeClasses(post.type)}`}>
              {typeInfo.emoji} {typeInfo.label}
            </span>
            {post.type === "question" && post.isResolved && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Resolved
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowPostMenu(!showPostMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                {showPostMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 min-w-[150px] z-10">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowPostMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Post
                    </button>
                    {post.type === "question" && (
                      <button
                        onClick={() => {
                          handleMarkResolved();
                          setShowPostMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        {post.isResolved ? "Mark Unresolved" : "Mark Resolved"}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleDeletePost();
                        setShowPostMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5">
            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {post.author?.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  post.author?.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div>
                <span className="font-semibold text-gray-900">{post.author?.name}</span>
                <div className="text-xs text-gray-500">
                  {post.author?.branch} • Year {post.author?.year} • {formatDistanceToNow(post.createdAt)}
                </div>
              </div>
            </div>

            {/* Title & Content */}
            {isEditing ? (
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <textarea
                  value={editPostContent}
                  onChange={(e) => setEditPostContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdatePost}
                    className="px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditTitle(post.title);
                      setEditPostContent(post.content);
                    }}
                    className="px-4 py-1.5 bg-gray-100 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
                <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>
              </>
            )}

            {/* Images */}
            {post.images && post.images.length > 0 && (
              <div className="mb-4 space-y-2">
                {post.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={`Post image ${i + 1}`}
                    className="w-full rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Link */}
            {post.link && (
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-4 h-4" />
                {post.link}
              </a>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 py-3 border-t border-b border-gray-100">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  post.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`} />
                {post.likeCount} Likes
              </button>
              <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                <MessageCircle className="w-5 h-5" />
                {post.commentCount} Comments
              </span>
            </div>

            {/* Comments */}
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-4">Comments</h3>

              {loading ? (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No comments yet. Be the first!</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => {
                    const isCommentOwner = user && comment.author?._id === user._id;
                    const isEditingThis = editingComment === comment._id;

                    return (
                      <div key={comment._id} className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {comment.author?.avatar ? (
                            <img
                              src={comment.author.avatar}
                              alt={comment.author.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            comment.author?.name?.charAt(0).toUpperCase() || "U"
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-gray-900">
                                {comment.author?.name}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDistanceToNow(comment.createdAt)}
                              </span>
                            </div>
                            {isEditingThis ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  rows={2}
                                  className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditComment(comment._id)}
                                    className="px-3 py-1 bg-emerald-500 text-white rounded text-xs"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingComment(null)}
                                    className="px-3 py-1 bg-gray-200 rounded text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 ml-1">
                            <button
                              onClick={() => handleCommentLike(comment._id)}
                              className={`flex items-center gap-1 text-xs ${
                                comment.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                              }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? "fill-current" : ""}`} />
                              {comment.likeCount}
                            </button>
                            {isCommentOwner && !isEditingThis && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingComment(comment._id);
                                    setEditContent(comment.content);
                                  }}
                                  className="text-xs text-gray-400 hover:text-gray-600"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment._id)}
                                  className="text-xs text-gray-400 hover:text-red-500"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comment Input */}
        <form onSubmit={handleAddComment} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostDetailModal;
