import React, { useState, useEffect } from 'react';
import { Users, FileText, Briefcase, FileUp, Eye, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../services/axiosInstance';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    uploadedPapers: 0,
    placementsPosted: 0,
    studentsByYear: [],
    placementStats: [],
    recentPapers: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/dashboard/stats');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Colors for pie chart
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-3xl" style={{ color }}>{icon}</div>
      </div>
    </div>
  );

  return (
    <><h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2><div className="space-y-6">
      <br></br>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={loading ? '...' : dashboardData.totalUsers}
          icon={<Users />}
          color="#3b82f6" />
        <StatCard
          title="Uploaded Papers"
          value={loading ? '...' : dashboardData.uploadedPapers}
          icon={<FileText />}
          color="#10b981" />
        <StatCard
          title="Placements Posted"
          value={loading ? '...' : dashboardData.placementsPosted}
          icon={<Briefcase />}
          color="#f59e0b" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Year - Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Students Distribution by Year</h3>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : dashboardData.studentsByYear.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.studentsByYear}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, count, percent }) => `Year ${_id}: ${count} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {dashboardData.studentsByYear.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No student data available</p>
            </div>
          )}
        </div>

        {/* Placement Rate Average - Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Placement Statistics by Branch</h3>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : dashboardData.placementStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.placementStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="totalPlacements" fill="#3b82f6" name="Total Placements" />
                <Bar yAxisId="right" dataKey="avgPackage" fill="#10b981" name="Avg Package (LPA)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No placement data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Papers Uploaded */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Papers Uploaded</h3>
          <FileUp className="w-5 h-5 text-blue-500" />
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : dashboardData.recentPapers.length > 0 ? (
          <div className="space-y-3">
            {dashboardData.recentPapers.map((paper) => (
              <div key={paper._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{paper.subject}</p>
                  <p className="text-xs text-gray-600">{paper.branch} • {paper.examType} • Year {paper.year} • Sem {paper.semester}</p>
                  <p className="text-xs text-gray-500">Uploaded by {paper.uploadedBy?.name || 'Unknown'}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500">No recent papers available</p>
          </div>
        )}
      </div>
    </div></>
  );
};

export default AdminDashboard;