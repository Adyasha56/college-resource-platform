import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Briefcase,
  FileUp,
  Eye,
  Trash2,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${color}18` }}
    >
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
        {title}
      </p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
        {loading ? (
          <span className="inline-block w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        ) : (
          value
        )}
      </p>
    </div>
  </div>
);

const ChartCard = ({ title, children, loading }) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">{title}</h3>
    {loading ? (
      <div className="h-64 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm">Loading data...</span>
        </div>
      </div>
    ) : (
      children
    )}
  </div>
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    uploadedPapers: 0,
    placementsPosted: 0,
    studentsByYear: [],
    placementStats: [],
    recentPapers: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/dashboard/stats");
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Overview of your platform activity
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={dashboardData.totalUsers}
          icon={Users}
          color="#3b82f6"
          loading={loading}
        />
        <StatCard
          title="Uploaded Papers"
          value={dashboardData.uploadedPapers}
          icon={FileText}
          color="#10b981"
          loading={loading}
        />
        <StatCard
          title="Placements Posted"
          value={dashboardData.placementsPosted}
          icon={Briefcase}
          color="#f59e0b"
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Students Distribution by Year" loading={loading}>
          {dashboardData.studentsByYear.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={dashboardData.studentsByYear}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, count, percent }) =>
                    `Year ${_id}: ${count} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={90}
                  dataKey="count"
                >
                  {dashboardData.studentsByYear.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              No student data available
            </div>
          )}
        </ChartCard>

        <ChartCard title="Placement Statistics by Branch" loading={loading}>
          {dashboardData.placementStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dashboardData.placementStats} margin={{ top: 0, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar yAxisId="left" dataKey="totalPlacements" fill="#3b82f6" name="Total Placements" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="avgPackage" fill="#10b981" name="Avg Package (LPA)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              No placement data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Recent Papers */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <FileUp className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Recent Papers Uploaded
            </h3>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {dashboardData.recentPapers.length} items
          </span>
        </div>

        {loading ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : dashboardData.recentPapers.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {dashboardData.recentPapers.map((paper) => (
              <div
                key={paper._id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {paper.subject}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {paper.branch} &bull; {paper.examType} &bull; Year {paper.year} &bull; Sem {paper.semester}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    Uploaded by {paper.uploadedBy?.name || "Unknown"}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                    title="View paper"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    title="Delete paper"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
            <TrendingUp className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">No recent papers available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
