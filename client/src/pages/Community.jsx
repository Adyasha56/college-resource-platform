import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/community/PostCard";
import CreatePostModal from "../components/community/CreatePostModal";
import PostTypeFilter from "../components/community/PostTypeFilter";
import PostDetailModal from "../components/community/PostDetailModal";
import {
  Plus,
  RefreshCw,
  MessageSquare,
  TrendingUp,
  Clock,
  Filter,
  Users,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Filters
  const [activeType, setActiveType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [filterMyBatch, setFilterMyBatch] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: pageNum,
        limit: 10,
        sort: sortBy,
      });

      if (activeType !== "all") params.append("type", activeType);
      if (filterMyBatch && user) {
        params.append("year", user.year);
        params.append("branch", user.branch);
      }

      const res = await fetch(`${API_URL}/api/posts?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        if (append) {
          setPosts(prev => [...prev, ...data.posts]);
        } else {
          setPosts(data.posts);
        }
        setHasMore(pageNum < data.pagination.pages);
        setPage(pageNum);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to load posts");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeType, sortBy, filterMyBatch, user]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1, true);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreateModal(false);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
    setSelectedPost(null);
  };

  const handleLikeToggle = (postId, likeCount, isLiked) => {
    setPosts(prev => prev.map(p => 
      p._id === postId ? { ...p, likeCount, isLiked } : p
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-7 h-7 text-emerald-500" />
              Community
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Connect, share, and learn together
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Post
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          {/* Post Type Filter */}
          <PostTypeFilter 
            activeType={activeType} 
            onChange={(type) => {
              setActiveType(type);
              setPage(1);
            }} 
          />

          {/* Sort & Additional Filters */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <button
                onClick={() => setSortBy("recent")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  sortBy === "recent"
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Clock className="w-4 h-4" />
                Recent
              </button>
              <button
                onClick={() => setSortBy("popular")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  sortBy === "popular"
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Popular
              </button>
            </div>

            <button
              onClick={() => setFilterMyBatch(!filterMyBatch)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filterMyBatch
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users className="w-4 h-4" />
              My Year/Branch
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <div className="w-32 h-4 bg-gray-200 rounded" />
                    <div className="w-24 h-3 bg-gray-100 rounded mt-2" />
                  </div>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded mb-2" />
                <div className="w-3/4 h-4 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => fetchPosts(1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg mx-auto hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 mb-6">
              Be the first to share something with the community!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onClick={() => setSelectedPost(post)}
                onLikeToggle={handleLikeToggle}
              />
            ))}

            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full py-3 bg-white rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onPostUpdated={handlePostUpdated}
          onPostDeleted={handlePostDeleted}
          onLikeToggle={handleLikeToggle}
        />
      )}
    </div>
  );
};

export default Community;
