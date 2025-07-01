import { Routes, Route } from "react-router-dom";

// Pages (yeh sab bana lenge one-by-one)
import Home from "../pages/Home";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import QuestionPapers from "../pages/QuestionPapers";
// import Placements from "../pages/Placements";
// import AdminDashboard from "../pages/admin/Dashboard";
// import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/question-papers" element={<QuestionPapers />} />
      <Route path="/placements" element={<Placements />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
