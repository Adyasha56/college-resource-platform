import { useState, useEffect } from "react";
import { Bell, MessageCircle, X, Trash2, RefreshCw, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "../utils/dateUtils";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/notifications?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to load notifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/notifications`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setNotifications([]);
    } catch (error) {
      console.error("Clear notifications error:", error);
    }
  };

  const handleDeleteOne = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Notifications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Stay updated with your community activity
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="w-3/4 h-3.5 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                  <div className="w-1/4 h-3 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 dark:text-red-400 font-medium text-sm mb-4">{error}</p>
            <button
              onClick={fetchNotifications}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg mx-auto hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-600 dark:text-slate-400 mb-1">
              No notifications yet
            </h3>
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              When someone interacts with your posts, you'll see it here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
              >
                {/* Avatar */}
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {notification.sender?.avatar ? (
                    <img
                      src={notification.sender.avatar}
                      alt={notification.sender.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    notification.sender?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 dark:text-slate-200">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {formatDistanceToNow(notification.createdAt)}
                    </span>
                    {notification.post && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {notification.post.type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDeleteOne(notification._id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-all flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
