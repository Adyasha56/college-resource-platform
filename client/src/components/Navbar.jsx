// src/components/Navbar.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
  logout();
   navigate("/");
 };

  return (
    <nav className="bg-primaryDark text-background px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          CollegeHub
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/question-papers" className="hover:text-secondary transition">
            Question Papers
          </Link>
          <Link to="/placements" className="hover:text-secondary transition">
            Placements
          </Link>

          {!user ? (
            <Link to="/login" className="hover:text-secondary transition">
              Login
            </Link>
          ) : (
            <>
              <button onClick={handleLogout} className="hover:text-secondary transition">
                Logout
              </button>
              <Link to="/profile" className="flex items-center justify-center w-9 h-9 rounded-full bg-white">
                <UserCircle className="w-6 h-6 text-primaryDark" />
              </Link>

            </>
          )}
        </div>

        {/* Hamburger Menu */}
        <button onClick={toggleMenu} className="md:hidden">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-4">
          <Link to="/question-papers" onClick={toggleMenu} className="hover:text-secondary">
            Question Papers
          </Link>
          <Link to="/placements" onClick={toggleMenu} className="hover:text-secondary">
            Placements
          </Link>
          {!user ? (
            <Link to="/login" onClick={toggleMenu} className="hover:text-secondary">
              Login
            </Link>
          ) : (
            <>
              <button onClick={() => { handleLogout(); toggleMenu(); }} className="hover:text-secondary">
                Logout
              </button>
            <Link to="/profile" onClick={toggleMenu} className="flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-white hover:text-secondary" />
                 <span className="text-white text-sm">Profile</span>
            </Link>

            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
