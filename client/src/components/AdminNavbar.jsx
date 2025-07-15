// src/components/AdminNavbar.jsx
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminNavbar = () => {
  const { logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    setTimeout(() => {
      navigate("/admin/login");
    }, 50);
  };

  return (
    <nav className="bg-yellow-100 p-4 flex justify-between items-center shadow-md">
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/admin/dashboard")}
      >
        CollegeHub Admin
      </div>

      <button
        onClick={handleLogout}
        className="text-red-600 hover:text-red-800 font-semibold"
      >
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;
