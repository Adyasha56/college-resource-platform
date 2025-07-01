import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="mt-16 px-4">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
