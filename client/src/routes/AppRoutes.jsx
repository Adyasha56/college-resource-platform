import { Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "../layout/Mainlayout";

// Pages (yeh sab bana lenge one-by-one)
import Home from "../pages/Home";
import Login from '../features/auth/Login';
import Register from "../features/auth/Register";
import Profile from "../pages/Profile";
import AdminRoutes from "./AdminRoutes";
import QuestionPapers from "../pages/QuestionPapers";
import Placements from "../pages/Placements";
// import AdminDashboard from "../pages/admin/Dashboard";
// import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home page without MainLayout (has its own navbar) */}
      <Route path="/" element={<Home />} />
      
      {/* Routes with MainLayout (Navbar + Sidebar) */}
      <Route element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/placements" element={<Placements />} />
        <Route path="/question-papers" element={<QuestionPapers />} />
      </Route>
      
      {/* Admin routes (separate layout) */}
      <Route path="/admin/*" element={<AdminRoutes />} />
   
      {/* <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />  */}
    </Routes>
  );
};

export default AppRoutes;