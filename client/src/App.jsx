import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


function App() {
  return (
    <BrowserRouter>
      <div className="bg-yellow-100 min-h-screen">
        <Navbar />
        <AppRoutes />
      </div>
      <Footer />
    </BrowserRouter>
  );
}



export default App;
