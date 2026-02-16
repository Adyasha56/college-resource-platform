import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../services/axiosInstance";
import {
  LayoutDashboard,
  FileText,
  Building2,
  User,
  LogOut,
  Menu,
  X,
  Calendar,
  TrendingUp,
  Clock,
  ChevronRight,
  GraduationCap,
  MessageSquare,
  BookOpen,
  Briefcase,
  Activity,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      title: "Total Question Papers",
      value: "0",
      icon: BookOpen,
      color: "bg-blue-500",
      
    },
    {
      title: "Total Placements",
      value: "0",
      icon: Briefcase,
      color: "bg-emerald-500",
      
    },
    {
      title: "Placement Rate",
      value: "0%",
      icon: TrendingUp,
      color: "bg-purple-500",
      
    },
    {
      title: "This Month",
      value: "0",
      icon: Calendar,
      color: "bg-orange-500",
      
    },
  ]);
  const [recentQuestionPapers, setRecentQuestionPapers] = useState([]);
  const [recentPlacements, setRecentPlacements] = useState([]);
  const [communityActivity, setCommunityActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch question papers
      const paperRes = await axiosInstance.get("/questionpapers/");
      const papers = (paperRes.data?.data || paperRes.data || []);
      
      // Fetch placements
      const placementRes = await axiosInstance.get("/placements/");
      const placements = (Array.isArray(placementRes.data) ? placementRes.data : placementRes.data?.data || []);
      
      // Fetch community posts
      const postsRes = await axiosInstance.get("/posts/");
      const posts = (postsRes.data?.posts || postsRes.data || []);

      // Update stats
      const totalPapers = Array.isArray(papers) ? papers.length : 0;
      const totalPlacements = Array.isArray(placements) ? placements.length : 0;
      
      // Calculate placement rate (students placed / applied)
      let totalApplied = 0;
      let totalPlaced = 0;
      if (Array.isArray(placements)) {
        placements.forEach(p => {
          totalApplied += p.studentsApplied || 0;
          totalPlaced += p.studentsPlaced || 0;
        });
      }
      
      const placementRate = totalApplied > 0 
        ? Math.round((totalPlaced / totalApplied) * 100)
        : 0;

      setStats([
        {
          title: "Total Question Papers",
          value: totalPapers.toString(),
          icon: BookOpen,
          color: "bg-blue-500",
          // change: `+${Math.floor(totalPapers * 0.15)}%`,
        },
        {
          title: "Total Placements",
          value: totalPlacements.toString(),
          icon: Briefcase,
          color: "bg-emerald-500",
          // change: `+${Math.floor(totalPlacements * 0.2)}%`,
        },
        {
          title: "Placement Rate",
          value: `${placementRate}%`,
          icon: TrendingUp,
          color: "bg-purple-500",
          
        },
        {
          title: "Community Posts",
          value: (Array.isArray(posts) ? posts.length : 0).toString(),
          icon: Activity,
          color: "bg-orange-500",
          // change: `+${Math.floor((Array.isArray(posts) ? posts.length : 0) * 0.1)}%`,
        },
      ]);

      // Get recent papers (last 3)
      setRecentQuestionPapers(Array.isArray(papers) ? papers.slice(0, 3) : []);
      
      // Get recent placements (last 3-4)
      setRecentPlacements(Array.isArray(placements) ? placements.slice(0, 3) : []);
      
      // Get recent community posts (last 3-4)
      setCommunityActivity(Array.isArray(posts) ? posts.slice(0, 3) : []);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Community", icon: MessageSquare, path: "/community" },
    { name: "Question Papers", icon: FileText, path: "/question-papers" },
    { name: "Placement Records", icon: Building2, path: "/placements" },
    { name: "Profile", icon: User, path: "/profile" },
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
            {/* Recent Question Papers */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Recent Question Papers</h2>
                <Link
                  to="/question-papers"
                  className="text-emerald-500 hover:text-emerald-600 text-sm font-medium flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-6 text-center text-gray-500">Loading...</div>
                ) : recentQuestionPapers.length > 0 ? (
                  recentQuestionPapers.map((paper) => (
                    <div
                      key={paper._id}
                      className="p-4 md:p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{paper.subject}</h3>
                        <p className="text-sm text-gray-500">{paper.examType} - Sem {paper.semester}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-gray-900">{paper.branch}</p>
                        <p className="text-xs text-gray-500">{new Date(paper.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">No question papers available</div>
                )}
              </div>
            </div>

            {/* Right Sidebar - AI Recommendations Card */}
            <div className="space-y-6">
              {/* Smart Recommendations Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-900">Your AI Insights</h2>
                      <p className="text-sm text-gray-600 mt-1">Get personalized recommendations based on your career goal</p>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    {/* Project Ideas */}
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all border border-blue-100 hover:border-blue-300 group"
                    >
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600">Project Ideas</h3>
                        <p className="text-xs text-gray-500">Build real projects</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </Link>

                    {/* Learning Path */}
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all border border-green-100 hover:border-green-300 group"
                    >
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-green-600">Learning Path</h3>
                        <p className="text-xs text-gray-500">Structured learning</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                    </Link>

                    {/* Resources */}
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all border border-purple-100 hover:border-purple-300 group"
                    >
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-purple-600">Resources</h3>
                        <p className="text-xs text-gray-500">Curated resources</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                    </Link>

                    {/* AI Insights */}
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all border border-orange-100 hover:border-orange-300 group"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-orange-600">AI Insights</h3>
                        <p className="text-xs text-gray-500">Career guidance</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
                    </Link>
                  </div>

                  <Link
                    to="/profile"
                    className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-300 to-indigo-400 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    View Full Recommendations
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid - Recent Placements, Community Activity */}
          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            {/* Recent Placements */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Recent Placements</h2>
                <Link
                  to="/placements"
                  className="text-emerald-500 hover:text-emerald-600 text-sm font-medium flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-6 text-center text-gray-500">Loading...</div>
                ) : recentPlacements.length > 0 ? (
                  recentPlacements.map((placement) => (
                    <div
                      key={placement._id}
                      className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900">{placement.company}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="inline-block">CTC: {placement.ctc}</span>
                            <span className="mx-2">•</span>
                            <span className="inline-block">{placement.branch}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {placement.studentsPlaced} students placed out of {placement.studentsApplied}
                          </p>
                          {placement.requiredSkills && placement.requiredSkills.length > 0 && (
                            <div className="mt-2 flex gap-1 flex-wrap">
                              {placement.requiredSkills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                              {placement.requiredSkills.length > 3 && (
                                <span className="text-xs text-gray-500">+{placement.requiredSkills.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">No placements available</div>
                )}
              </div>
            </div>

            {/* Community Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Community Activity</h2>
                <Link
                  to="/community"
                  className="text-emerald-500 hover:text-emerald-600 text-sm font-medium flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-6 text-center text-gray-500">Loading...</div>
                ) : communityActivity.length > 0 ? (
                  communityActivity.map((post) => (
                    <div
                      key={post._id}
                      className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-purple-600">
                            {post.author?.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>
                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {post.likeCount} likes
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {post.commentCount} comments
                            </span>
                            {post.type && (
                              <span className="inline-block px-2 py-0.5 rounded capitalize" 
                                style={{
                                  backgroundColor: {
                                    'discussion': '#e0e7ff',
                                    'question': '#fef3c7',
                                    'achievement': '#dcfce7',
                                    'resource': '#cffafe',
                                    'project': '#f3e8ff'
                                  }[post.type] || '#f3f4f6',
                                  color: {
                                    'discussion': '#4f46e5',
                                    'question': '#d97706',
                                    'achievement': '#16a34a',
                                    'resource': '#0891b2',
                                    'project': '#a855f7'
                                  }[post.type] || '#6b7280'
                                }}>
                                {post.type}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">No community activity yet</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
