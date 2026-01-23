// src/components/Navbar.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-primaryDark text-background px-6 py-4 shadow-md z-50">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          EduHub
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          {!user ? (
            <Link to="/login" className="hover:text-secondary transition">
              Login
            </Link>
          ) : (
            <Link to="/profile" className="flex items-center justify-center w-9 h-9 rounded-full bg-white hover:ring-2 hover:ring-secondary transition">
              <UserCircle className="w-6 h-6 text-primaryDark" />
            </Link>
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
          {!user ? (
            <Link to="/login" onClick={toggleMenu} className="hover:text-secondary">
              Login
            </Link>
          ) : (
            <Link to="/profile" onClick={toggleMenu} className="flex items-center justify-center w-9 h-9 rounded-full bg-white">
              <UserCircle className="w-6 h-6 text-primaryDark" />
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
