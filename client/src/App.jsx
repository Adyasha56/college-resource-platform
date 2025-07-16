import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();

  // Hide Navbar and Footer on admin pages
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="bg-yellow-100 min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      
      <main className="flex-grow">
        <AppRoutes />
      </main>
      
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
