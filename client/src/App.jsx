import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";

function App() {
  const location = useLocation();
  const { user } = useAuth();

  // Hide Footer on admin pages
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="bg-yellow-100 min-h-screen flex flex-col">
      <main className="flex-grow">
        <AppRoutes />
      </main>
      
      {/* Footer with margin-left when sidebar is visible */}
      {!isAdminRoute && (
        <div className={`${user ? "md:ml-64" : ""} transition-all duration-300`}>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;