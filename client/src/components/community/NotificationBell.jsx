import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const NotificationBell = () => {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  // Fetch count on mount and poll every 30 seconds
  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/notifications/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setCount(data.count);
      }
    } catch (error) {
      console.error("Fetch notification count error:", error);
    }
  };

  const handleClick = () => {
    navigate("/notifications");
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
    >
      <Bell className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
