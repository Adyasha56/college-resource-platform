import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard,
  FileUp,
  Briefcase,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Upload Papers", path: "/admin/upload-papers", icon: FileUp },
  { label: "Placements", path: "/admin/placements", icon: Briefcase },
  { label: "Manage Users", path: "/admin/manage-users", icon: Users },
];

const AdminLayout = () => {
  const { admin, logoutAdmin } = useAdminAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Sidebar collapsed state (desktop)
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("adminSidebarCollapsed") === "true";
  });

  // Mobile drawer open state
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", collapsed);
  }, [collapsed]);

  // Close mobile drawer on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) {
      document.addEventListener("mousedown", handleOutside);
    }
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [mobileOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  const handleLogout = () => {
    logoutAdmin();
    setTimeout(() => navigate("/admin/login"), 50);
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-slate-700 dark:border-slate-700 ${
          collapsed && !isMobile ? "justify-center" : ""
        }`}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        {(!collapsed || isMobile) && (
          <div>
            <p className="text-white font-bold text-sm leading-tight">EduHub</p>
            <p className="text-blue-300 text-xs">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `no-underline flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                collapsed && !isMobile ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white hover:no-underline"
              }`
            }
            title={collapsed && !isMobile ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  }`}
                />
                {(!collapsed || isMobile) && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin info + Collapse toggle */}
      <div className="border-t border-slate-700 dark:border-slate-700 p-3 space-y-2">
        {(!collapsed || isMobile) && admin && (
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-slate-700/50">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">Admin</p>
              <p className="text-slate-400 text-xs truncate">{admin.email}</p>
            </div>
          </div>
        )}

        {/* Collapse button — desktop only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 text-sm transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-slate-100 dark:bg-slate-800">
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 bg-slate-900 dark:bg-slate-950 transition-all duration-300 h-screen sticky top-0 overflow-y-auto ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Drawer Overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" aria-hidden="true" />
      )}

      {/* ── Mobile Drawer ── */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-64 z-50 bg-slate-900 dark:bg-slate-950 flex flex-col lg:hidden transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end p-3 border-b border-slate-700">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent isMobile />
      </div>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* ── Top Navbar ── */}
        <header className="flex-shrink-0 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 shadow-sm">
          {/* Left: hamburger (mobile) + page brand (desktop) */}
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-slate-900 dark:text-white font-semibold text-sm hidden sm:block">
              Admin Panel
            </span>
          </div>

          {/* Right: theme toggle + logout */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Admin avatar — desktop */}
            {admin && (
              <div className="hidden sm:flex items-center gap-2 px-1">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
