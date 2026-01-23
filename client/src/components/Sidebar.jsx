// src/components/Sidebar.jsx

import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileText, Briefcase, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-primaryDark text-white flex flex-col z-40 shadow-lg">
      {/* Menu Items */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
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
  );
};

export default Sidebar;
