import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Sidebar only visible when logged in */}
      {user && <Sidebar />}
      
      {/* Main content - adjust margin when sidebar is visible */}
      <main className={`pt-16 ${user ? "md:ml-64" : ""} transition-all duration-300`}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
