import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Building2,
  User,
  LogOut,
  Menu,
  X,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Question Papers", icon: FileText, path: "/question-papers" },
    { name: "Placement Records", icon: Building2, path: "/placements" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  // Dummy download data
  const recentDownloads = [
    {
      id: 1,
      name: "Data Structures - 2024",
      type: "Question Paper",
      date: "Jan 24, 2026",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Operating Systems - Mid Sem",
      type: "Question Paper",
      date: "Jan 23, 2026",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "DBMS Final Exam - 2023",
      type: "Question Paper",
      date: "Jan 22, 2026",
      size: "3.1 MB",
    },
    {
      id: 4,
      name: "Computer Networks - 2024",
      type: "Question Paper",
      date: "Jan 20, 2026",
      size: "2.2 MB",
    },
    {
      id: 5,
      name: "Machine Learning - End Sem",
      type: "Question Paper",
      date: "Jan 18, 2026",
      size: "4.5 MB",
    },
  ];

  const stats = [
    {
      title: "Total Downloads",
      value: "24",
      icon: Download,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Papers Viewed",
      value: "156",
      icon: FileText,
      color: "bg-emerald-500",
      change: "+8%",
    },
    {
      title: "This Month",
      value: "18",
      icon: Calendar,
      color: "bg-purple-500",
      change: "+24%",
    },
    {
      title: "Saved Papers",
      value: "12",
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "+5%",
    },
  ];

  const upcomingExams = [
    { subject: "Data Structures", date: "Feb 10, 2026", daysLeft: 16 },
    { subject: "Operating Systems", date: "Feb 12, 2026", daysLeft: 18 },
    { subject: "Computer Networks", date: "Feb 15, 2026", daysLeft: 21 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#1a1a2e] transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EduHub</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="text-white font-semibold">{user?.name || "User"}</h3>
                <p className="text-gray-400 text-sm">{user?.branch || "Student"} - Year {user?.year || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">EduHub</span>
          </Link>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, {user?.name?.split(" ")[0] || "User"}
            </h1>
            <p className="text-gray-500 mt-1">Here's what's happening with your studies</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-emerald-500 text-sm font-medium">{stat.change}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Downloads */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Recent Downloads</h2>
                <Link
                  to="/question-papers"
                  className="text-emerald-500 hover:text-emerald-600 text-sm font-medium flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentDownloads.map((download) => (
                  <div
                    key={download.id}
                    className="p-4 md:p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{download.name}</h3>
                      <p className="text-sm text-gray-500">{download.type}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-gray-900">{download.size}</p>
                      <p className="text-xs text-gray-500">{download.date}</p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Exams */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Exams</h2>
                <div className="space-y-4">
                  {upcomingExams.map((exam, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{exam.subject}</h4>
                        <p className="text-xs text-gray-500">{exam.date}</p>
                      </div>
                      <span className="text-xs font-medium text-orange-500 bg-orange-100 px-2 py-1 rounded-full">
                        {exam.daysLeft} days
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 text-white">
                <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    to="/question-papers"
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <span className="font-medium">Browse Papers</span>
                  </Link>
                  <Link
                    to="/placements"
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">View Placements</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <User className="w-5 h-5 text-purple-400" />
                    <span className="font-medium">Edit Profile</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
