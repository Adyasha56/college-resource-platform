import { useState } from "react";
import { Heart, MessageCircle, Check } from "lucide-react";
import { getPostTypeInfo, getPostTypeBadgeClasses } from "../../utils/postTypeUtils";
import { formatDistanceToNow } from "../../utils/dateUtils";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const PostCard = ({ post, onClick, onLikeToggle }) => {
  const [isLiking, setIsLiking] = useState(false);
  
  const typeInfo = getPostTypeInfo(post.type);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/posts/${post._id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        onLikeToggle(post._id, data.likeCount, data.isLiked);
      }
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
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
            
            {/* Author Info */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {post.author?.name || "Unknown"}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getPostTypeBadgeClasses(post.type)}`}>
                  {typeInfo.emoji} {typeInfo.label}
                </span>
                {post.type === "question" && post.isResolved && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Resolved
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <span>{post.author?.branch} • Year {post.author?.year}</span>
                <span>•</span>
                <span>{formatDistanceToNow(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>

        {/* Content Preview */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {post.content}
        </p>

        {/* Images Preview */}
        {post.images && post.images.length > 0 && (
          <div className="mb-3 rounded-lg overflow-hidden">
            {post.images.length === 1 ? (
              <img
                src={post.images[0].url}
                alt="Post"
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="grid grid-cols-2 gap-1">
                {post.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img.url}
                      alt={`Post ${i + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    {i === 3 && post.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                        +{post.images.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Link Preview */}
        {post.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="block mb-3 p-3 bg-gray-50 rounded-lg text-sm text-blue-600 hover:text-blue-800 truncate"
          >
            🔗 {post.link}
          </a>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              post.isLiked
                ? "text-red-500"
                : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`}
            />
            <span>{post.likeCount}</span>
          </button>

          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
