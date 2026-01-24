// src/components/Sidebar.jsx

import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileText, Briefcase, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      path: "/question-papers",
      label: "Question Papers",
      icon: FileText,
    },
    {
      path: "/placements",
      label: "Placement Records",
      icon: Briefcase,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 md:hidden bg-primaryDark text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-primaryDark text-white flex flex-col z-40 shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Menu Items */}
        <nav className="flex-1 py-6">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-secondary text-primaryDark font-semibold"
                      : "hover:bg-gray-700 hover:text-secondary"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button at Bottom */}
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
