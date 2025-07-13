import { Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminLayout = () => {
  const { admin, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primaryDark text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/admin/upload-papers")}>Upload Papers</button>
          <button onClick={() => navigate("/admin/placements")}>Placements</button>
          <button onClick={() => navigate("/admin/manage-users")}>Manage Users</button>
          <button onClick={handleLogout} className="text-red-400 hover:text-red-600">
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
