import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
// import UploadPapers from "../pages/admin/UploadPapers";
// import PlacementRecords from "../pages/admin/PlacementRecords";
// import ManageUsers from "../pages/admin/ManageUsers";
import AdminLayout from "../layout/AdminLayout";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminRoutes = () => {
  const { admin } = useAdminAuth();

  return (
    <Routes>
      {/* Admin Login Page (no layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes inside Layout */}
      {admin ? (
        <>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            {/* <Route path="upload-papers" element={<UploadPapers />} />
            <Route path="placements" element={<PlacementRecords />} />
            <Route path="manage-users" element={<ManageUsers />} /> */}
        </Route>
        </>
      ) : (
        // If not logged in, redirect all /admin/* to /admin/login
        <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
      )}
    </Routes>
  );
};

export default AdminRoutes;
