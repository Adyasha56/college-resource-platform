import AdminNavbar from "../components/AdminNavbar"; 
import { Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminLayout = () => {
  const { admin } = useAdminAuth();
  const navigate = useNavigate(); 

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar /> 

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-primaryDark text-white p-6 space-y-4">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <nav className="flex flex-col space-y-2">
            <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/admin/upload-papers")}>Upload Papers</button>
            <button onClick={() => navigate("/admin/placements")}>Placements</button>
            <button onClick={() => navigate("/admin/manage-users")}>Manage Users</button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
