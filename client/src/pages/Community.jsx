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
  Users,
  AlertCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [activeType, setActiveType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [filterMyBatch, setFilterMyBatch] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const token = localStorage.getItem("token");
        const params = new URLSearchParams({ page: pageNum, limit: 10, sort: sortBy });
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
          if (append) setPosts((prev) => [...prev, ...data.posts]);
          else setPosts(data.posts);
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
    },
    [activeType, sortBy, filterMyBatch, user]
  );

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) fetchPosts(page + 1, true);
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setShowCreateModal(false);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    setSelectedPost(null);
  };

  const handleLikeToggle = (postId, likeCount, isLiked) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, likeCount, isLiked } : p))
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            EduHub Community
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Connect, share, and learn together
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-4">
        <PostTypeFilter
          activeType={activeType}
          onChange={(type) => {
            setActiveType(type);
            setPage(1);
          }}
        />

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Sort:</span>
            <button
              onClick={() => setSortBy("recent")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                sortBy === "recent"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Recent
            </button>
            <button
              onClick={() => setSortBy("popular")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                sortBy === "popular"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Popular
            </button>
          </div>

          <button
            onClick={() => setFilterMyBatch(!filterMyBatch)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterMyBatch
                ? "bg-blue-600 text-white"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            My Year/Branch
          </button>
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div>
                  <div className="w-28 h-3.5 bg-slate-200 dark:bg-slate-700 rounded mb-1.5" />
                  <div className="w-20 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
              </div>
              <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <div className="w-3/4 h-4 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 dark:text-red-400 font-medium mb-4">{error}</p>
          <button
            onClick={() => fetchPosts(1)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg mx-auto hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm text-slate-700 dark:text-slate-300"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
            No posts yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
            Be the first to share something with the community!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
          >
            Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
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
              className="w-full py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
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

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}

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
