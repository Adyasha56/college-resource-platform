import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import AdminLayout from "../layout/AdminLayout";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminRoutes = () => {
  const { admin } = useAdminAuth();

  return (
    <Routes>
      {/* Show Login if not logged in */}
      <Route path="login" element={<AdminLogin />} />

      {admin ? (
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          {/* Add more routes here */}
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="login" replace />} />
      )}
    </Routes>
  );
};

export default AdminRoutes;
