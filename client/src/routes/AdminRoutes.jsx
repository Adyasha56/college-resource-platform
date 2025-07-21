import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import AdminLayout from "../layout/AdminLayout";
import { useAdminAuth } from "../context/AdminAuthContext";
import AdminPlacements from "../pages/admin/AdminPlacements";

const AdminRoutes = () => {
  const { admin } = useAdminAuth();

  return (
    <Routes>
      {/* Use relative path - remove the leading '/' */}
      <Route path="login" element={<AdminLogin />} />

      {admin ? (
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="placements" element={<AdminPlacements />} />
          {/* Add more protected admin routes here */}
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      )}
    </Routes>
  );
};

export default AdminRoutes;