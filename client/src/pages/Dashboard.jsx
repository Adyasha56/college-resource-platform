import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../services/axiosInstance";
import {
  FileText,
  Building2,
  TrendingUp,
  Calendar,
  ChevronRight,
  BookOpen,
  Briefcase,
  Activity,
  MessageSquare,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: "Total Question Papers", value: "0", icon: BookOpen, color: "bg-blue-500" },
    { title: "Total Placements", value: "0", icon: Briefcase, color: "bg-green-500" },
    { title: "Placement Rate", value: "0%", icon: TrendingUp, color: "bg-amber-500" },
    { title: "Community Posts", value: "0", icon: Activity, color: "bg-slate-500" },
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

      const paperRes = await axiosInstance.get("/questionpapers/");
      const papers = paperRes.data?.data || paperRes.data || [];

      const placementRes = await axiosInstance.get("/placements/");
      const placements = Array.isArray(placementRes.data)
        ? placementRes.data
        : placementRes.data?.data || [];

      const postsRes = await axiosInstance.get("/posts/");
      const posts = postsRes.data?.posts || postsRes.data || [];

      const totalPapers = Array.isArray(papers) ? papers.length : 0;
      const totalPlacements = Array.isArray(placements) ? placements.length : 0;

      let totalApplied = 0;
      let totalPlaced = 0;
      if (Array.isArray(placements)) {
        placements.forEach((p) => {
          totalApplied += p.studentsApplied || 0;
          totalPlaced += p.studentsPlaced || 0;
        });
      }

      const placementRate =
        totalApplied > 0 ? Math.round((totalPlaced / totalApplied) * 100) : 0;
      const totalPosts = Array.isArray(posts) ? posts.length : 0;

      setStats([
        { title: "Total Question Papers", value: totalPapers.toString(), icon: BookOpen, color: "bg-blue-500" },
        { title: "Total Placements", value: totalPlacements.toString(), icon: Briefcase, color: "bg-green-500" },
        { title: "Placement Rate", value: `${placementRate}%`, icon: TrendingUp, color: "bg-amber-500" },
        { title: "Community Posts", value: totalPosts.toString(), icon: Activity, color: "bg-slate-500" },
      ]);

      setRecentQuestionPapers(Array.isArray(papers) ? papers.slice(0, 3) : []);
      setRecentPlacements(Array.isArray(placements) ? placements.slice(0, 3) : []);
      setCommunityActivity(Array.isArray(posts) ? posts.slice(0, 3) : []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const POST_TYPE_STYLES = {
    discussion: { bg: "#e0e7ff", text: "#4f46e5" },
    question: { bg: "#fef3c7", text: "#d97706" },
    achievement: { bg: "#dcfce7", text: "#16a34a" },
    resource: { bg: "#cffafe", text: "#0891b2" },
    project: { bg: "#f1f5f9", text: "#475569" },
  };

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.name?.split(" ")[0] || "Student"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Here's what's happening with your studies
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Question Papers */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Question Papers
            </h2>
            <Link
              to="/question-papers"
              className="text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-1 no-underline hover:underline"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading ? (
              <div className="p-5 text-center text-slate-500 dark:text-slate-400 text-sm">
                Loading...
              </div>
            ) : recentQuestionPapers.length > 0 ? (
              recentQuestionPapers.map((paper) => (
                <div
                  key={paper._id}
                  className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {paper.subject}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {paper.examType} · Sem {paper.semester}
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-700 dark:text-slate-300">{paper.branch}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(paper.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-center text-slate-500 dark:text-slate-400 text-sm">
                No question papers available
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Quick Links</h2>
          </div>
          <div className="p-4 space-y-2">
            {[
              { label: "Browse Question Papers", path: "/question-papers", icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
              { label: "Placement Records", path: "/placements", icon: Building2, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
              { label: "Community", path: "/community", icon: MessageSquare, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
              { label: "My Profile", path: "/profile", icon: TrendingUp, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" },
            ].map(({ label, path, icon: Icon, color, bg }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors no-underline group"
              >
                <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                  {label}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-5 mt-5">
        {/* Recent Placements */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Placements
            </h2>
            <Link
              to="/placements"
              className="text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-1 no-underline hover:underline"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading ? (
              <div className="p-5 text-center text-slate-500 dark:text-slate-400 text-sm">
                Loading...
              </div>
            ) : recentPlacements.length > 0 ? (
              recentPlacements.map((placement) => (
                <div
                  key={placement._id}
                  className="px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {placement.company}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        CTC: {placement.ctc} · {placement.branch}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {placement.studentsPlaced} placed / {placement.studentsApplied} applied
                      </p>
                      {placement.requiredSkills?.length > 0 && (
                        <div className="mt-1.5 flex gap-1 flex-wrap">
                          {placement.requiredSkills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {placement.requiredSkills.length > 3 && (
                            <span className="text-xs text-slate-400">
                              +{placement.requiredSkills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-center text-slate-500 dark:text-slate-400 text-sm">
                No placements available
              </div>
            )}
          </div>
        </div>

        {/* Community Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Community Activity
            </h2>
            <Link
              to="/community"
              className="text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-1 no-underline hover:underline"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading ? (
              <div className="p-5 text-center text-slate-500 dark:text-slate-400 text-sm">
                Loading...
              </div>
            ) : communityActivity.length > 0 ? (
              communityActivity.map((post) => (
                <div
                  key={post._id}
                  className="px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {post.author?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {post.content}
                      </p>
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400">
                        <span>{post.likeCount} likes</span>
                        <span>{post.commentCount} comments</span>
                        {post.type && (
                          <span
                            className="px-2 py-0.5 rounded capitalize"
                            style={{
                              backgroundColor:
                                POST_TYPE_STYLES[post.type]?.bg || "#f1f5f9",
                              color: POST_TYPE_STYLES[post.type]?.text || "#475569",
                            }}
                          >
                            {post.type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-center text-slate-500 dark:text-slate-400 text-sm">
                No community activity yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
