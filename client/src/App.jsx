import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
// This is the main entry point of the React application.
// It sets up the BrowserRouter to enable routing in the app and renders the AppRoutes component
// which contains all the defined routes for the application.
// The BrowserRouter component wraps the AppRoutes to provide routing capabilities throughout the app.
// The AppRoutes component will define various routes for different pages like Home, Login, Register,
// Question Papers, Placements, Admin Dashboard, and a Not Found page.
// This structure allows for a clean separation of concerns, making it easier to manage and scale the application.
// The use of BrowserRouter ensures that the app can handle navigation and URL changes seamlessly,
// providing a smooth user experience as they navigate through different parts of the application.