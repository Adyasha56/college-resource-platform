import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-yellow-100 min-h-screen">
        <Navbar />
        <p className="text-red-500 text-center mt-4">App is rendering</p>
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}



export default App;
