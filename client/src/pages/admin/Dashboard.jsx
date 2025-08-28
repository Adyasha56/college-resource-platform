import React from 'react';
import { Users, FileText, Briefcase, Download, FileUp, Eye, Edit, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  // Small realistic dummy data
  const dashboardData = {
    totalUsers: 45,
    uploadedPapers: 23,
    placementsPosted: 8,
    totalDownloads: 156,
    recentPapers: [
      { _id: '1', subject: 'Data Structures', branch: 'CSE', examType: 'Mid-Term', year: 2024, semester: 3, uploadedBy: { name: 'Admin User' } },
      { _id: '2', subject: 'Engineering Math', branch: 'MECH', examType: 'Final', year: 2024, semester: 2, uploadedBy: { name: 'Prof. Sharma' } },
      { _id: '3', subject: 'Digital Electronics', branch: 'ECE', examType: 'Mid-Term', year: 2024, semester: 4, uploadedBy: { name: 'Dr. Patel' } }
    ],
    recentDownloads: [
      { _id: '1', fileName: 'Data_Structures_Mid-Term_2024.pdf', userId: { name: 'Rahul Sharma', branch: 'CSE', year: 2022 }, resourceId: { subject: 'Data Structures', branch: 'CSE' } },
      { _id: '2', fileName: 'Engineering_Math_Final_2023.pdf', userId: { name: 'Priya Patel', branch: 'MECH', year: 2021 }, resourceId: { subject: 'Engineering Math', branch: 'MECH' } },
      { _id: '3', fileName: 'Digital_Electronics_Mid_2024.pdf', userId: { name: 'Amit Singh', branch: 'ECE', year: 2023 }, resourceId: { subject: 'Digital Electronics', branch: 'ECE' } }
    ],
    recentPlacements: [
      { _id: '1', company: 'TCS', branch: 'CSE', year: 2024, ctc: '3.5 LPA', studentsSelected: ['Rahul Kumar', 'Priya Shah'] },
      { _id: '2', company: 'Infosys', branch: 'CSE', year: 2024, ctc: '4 LPA', studentsSelected: ['Amit Verma'] },
      { _id: '3', company: 'Wipro', branch: 'CSE', year: 2024, ctc: '3.2 LPA', studentsSelected: ['Ravi Singh'] }
    ],
    papersByBranch: [
      { branch: 'CSE', papers: 12, percentage: 52.2 },
      { branch: 'ECE', papers: 6, percentage: 26.1 },
      { branch: 'MECH', papers: 3, percentage: 13.0 },
      { branch: 'CIVIL', papers: 2, percentage: 8.7 }
    ],
    placementStats: [
      { company: 'TCS', selected: 2, applied: 8, successRate: 25.0 },
      { company: 'Infosys', selected: 1, applied: 5, successRate: 20.0 },
      { company: 'Wipro', selected: 1, applied: 6, successRate: 16.7 },
      { company: 'Accenture', selected: 3, applied: 12, successRate: 25.0 }
    ]
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && <p className="text-sm text-green-600 mt-1">↗ {trend}% from last month</p>}
        </div>
        <div className="text-3xl" style={{ color }}>{icon}</div>
      </div>
    </div>
  );

  return (
    <><h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2><div className="space-y-6">
      <br></br>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={dashboardData.totalUsers}
          icon={<Users />}
          color="#3b82f6"
          trend={5.2} />
        <StatCard
          title="Uploaded Papers"
          value={dashboardData.uploadedPapers}
          icon={<FileText />}
          color="#10b981"
          trend={12.3} />
        <StatCard
          title="Placements Posted"
          value={dashboardData.placementsPosted}
          icon={<Briefcase />}
          color="#f59e0b"
          trend={8.7} />
        <StatCard
          title="Total Downloads"
          value={dashboardData.totalDownloads}
          icon={<Download />}
          color="#ef4444"
          trend={15.1} />
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Uploaded Papers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Papers</h3>
            <FileUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {dashboardData.recentPapers.map((paper) => (
              <div key={paper._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{paper.subject}</p>
                  <p className="text-xs text-gray-600">{paper.branch} • {paper.examType} • Year {paper.year}</p>
                  <p className="text-xs text-gray-500">by {paper.uploadedBy.name}</p>
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
        </div>

        {/* Recent Downloads */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Downloads</h3>
            <Download className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            {dashboardData.recentDownloads.map((download) => (
              <div key={download._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{download.resourceId.subject}</p>
                  <p className="text-xs text-gray-600">{download.userId.name} • {download.userId.branch} {download.userId.year}</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Placements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Placements</h3>
            <Briefcase className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            {dashboardData.recentPlacements.map((placement) => (
              <div key={placement._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{placement.company}</p>
                  <p className="text-xs text-gray-600">CTC: {placement.ctc} • {placement.branch}</p>
                  <p className="text-xs text-gray-500">{placement.studentsSelected.length} selected</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-purple-600 hover:bg-purple-50 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Papers by Branch */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Papers by Branch</h3>
          <div className="space-y-4">
            {dashboardData.papersByBranch.map((branch, index) => (
              <div key={index} className="flex items-center">
                <div className="w-16 text-sm font-medium text-gray-700">{branch.branch}</div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${branch.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-sm font-medium text-gray-700">{branch.papers}</div>
                <div className="w-12 text-xs text-gray-500">{branch.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Placement Success Rate */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Placement Success Rates</h3>
          <div className="space-y-4">
            {dashboardData.placementStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{stat.company}</p>
                  <p className="text-sm text-gray-600">{stat.selected} selected out of {stat.applied} applicants</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{stat.successRate}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div></>
  );
};

export default AdminDashboard;