import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-primaryDark text-background px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          CollegeHub
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6">
          <Link to="/question-papers" className="hover:text-secondary transition">
            Question Papers
          </Link>
          <Link to="/placements" className="hover:text-secondary transition">
            Placements
          </Link>
          <Link to="/login" className="hover:text-secondary transition">
            Login
          </Link>
        </div>

        {/* Hamburger Button (Mobile) */}
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
          <Link to="/login" onClick={toggleMenu} className="hover:text-secondary">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
