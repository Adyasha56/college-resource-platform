import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-yellow-100 min-h-screen">
        <Navbar />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}



export default App;
