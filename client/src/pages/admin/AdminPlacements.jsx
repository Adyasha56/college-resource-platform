// src/pages/admin/AdminPlacements.jsx - COMPLETELY FIXED VERSION
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AdminPlacements = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState(null);
  const [activeTab, setActiveTab] = useState('records');
  
  const [formData, setFormData] = useState({
    company: "",
    branch: "",        
    year: 2025,
    ctc: "",
    requiredSkills: "",
    description: "",
    eligibleBranches: "",
    studentsSelected: []
  });

  const API_BASE_URL = process.env.BACKEND_URL;

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/placements`);
      const data = await res.json();
      setPlacements(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch placements', err);
      setLoading(false);
    }
  };

  // FIXED handleSubmit with proper auth header
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      
      console.log("🔍 DEBUG - Token from localStorage:", token);
      console.log("🔍 DEBUG - Token exists:", !!token);
      
      if (!token) {
        alert('Please login again. No admin token found.');
        return;
      }

      console.log("🔍 FORM DATA BEFORE SUBMIT:", formData);

      const url = editingPlacement 
        ? `${API_BASE_URL}/api/placements/${editingPlacement._id}`
        : `${API_BASE_URL}/api/placements`;
      
      const method = editingPlacement ? 'PUT' : 'POST';
      
      // Convert comma-separated strings to arrays and ensure proper data types
      const submitData = {
        company: formData.company,
        branch: formData.branch,
        year: parseInt(formData.year),
        ctc: formData.ctc,
        requiredSkills: formData.requiredSkills 
          ? formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s)
          : [],
        description: formData.description || '',
        eligibleBranches: formData.eligibleBranches
          ? formData.eligibleBranches.split(',').map(s => s.trim()).filter(s => s)
          : [],
        studentsSelected: formData.studentsSelected || []
      };
      
      console.log("🔍 SUBMIT DATA:", submitData);
      console.log("🔍 REQUEST URL:", url);
      console.log("🔍 REQUEST METHOD:", method);
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ✅ AUTH HEADER PROPERLY ADDED
      };
      
      console.log("🔍 REQUEST HEADERS:", headers);
      
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(submitData)
      });

      console.log("🔍 RESPONSE STATUS:", res.status);
      console.log("🔍 RESPONSE STATUS TEXT:", res.statusText);

      const responseData = await res.json();
      console.log("🔍 SERVER RESPONSE:", responseData);

      if (res.ok) {
        fetchPlacements();
        resetForm();
        setShowModal(false);
        alert(editingPlacement ? 'Placement updated successfully!' : 'Placement created successfully!');
        setActiveTab('records');
      } else {
        console.error('Server error:', responseData);
        
        if (res.status === 401) {
          alert('Session expired. Please login again.');
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
          return;
        }
        
        alert(`Error: ${responseData.message || 'Failed to save placement'}`);
      }
    } catch (err) {
      console.error('Error saving placement:', err);
      alert('Error saving placement: ' + err.message);
    }
  };

  // FIXED handleDelete with proper auth header
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this placement record?')) {
      try {
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          alert('Please login again. No admin token found.');
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/placements/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}` // ✅ AUTH HEADER PROPERLY ADDED
          }
        });
        
        if (res.ok) {
          fetchPlacements();
          alert('Placement deleted successfully!');
        } else {
          const errorData = await res.json();
          
          if (res.status === 401) {
            alert('Session expired. Please login again.');
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
            return;
          }
          
          alert(`Error: ${errorData.message || 'Failed to delete placement'}`);
        }
      } catch (err) {
        console.error('Error deleting placement:', err);
        alert('Error deleting placement: ' + err.message);
      }
    }
  };

  const handleEdit = (placement) => {
    setEditingPlacement(placement);
    setFormData({
      company: placement.company,
      branch: placement.branch || '', // FIXED: use branch instead of position
      year: placement.year,
      ctc: placement.ctc,
      requiredSkills: placement.requiredSkills?.join(', ') || '',
      description: placement.description || '',
      eligibleBranches: placement.eligibleBranches?.join(', ') || '',
      studentsSelected: placement.studentsSelected || []
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      company: "",
      branch: "", // FIXED: use branch instead of position
      year: 2025,
      ctc: "",
      requiredSkills: "",
      description: "",
      eligibleBranches: "",
      studentsSelected: []
    });
    setEditingPlacement(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Placement Management</h1>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('records')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'records'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Placement Records ({placements.length})
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'add'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Add New Placement
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'records' && (
          <div className="space-y-6">
            {placements.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No placement records found</div>
                <button
                  onClick={() => setActiveTab('add')}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Add First Placement
                </button>
              </div>
            ) : (
              placements.map((placement) => (
                <motion.div
                  key={placement._id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{placement.company}</h3>
                      <p className="text-blue-600 font-medium">{placement.branch}</p>
                      <p className="text-gray-600 mt-1">{placement.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(placement)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(placement._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-gray-500 text-sm">Branch:</span>
                      <p className="font-semibold">{placement.branch}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Year:</span>
                      <p className="font-semibold">{placement.year}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">CTC:</span>
                      <p className="font-semibold text-green-600">{placement.ctc}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Students Selected:</span>
                      <p className="font-semibold text-blue-600">
                        {placement.studentsSelected?.length || 0}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-gray-500 text-sm">Eligible Branches:</span>
                    <p className="text-sm">{placement.eligibleBranches?.join(', ')}</p>
                  </div>

                  {/* Students Selected Section */}
                  {placement.studentsSelected && placement.studentsSelected.length > 0 && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">
                        🎉 Students Selected ({placement.studentsSelected.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {placement.studentsSelected.map((student, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="text-sm">
                              {typeof student === 'string' ? student : student.name || 'Student'}
                              {student.branch && ` (${student.branch})`}
                              {student.package && ` - ${student.package}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Required Skills */}
                  {placement.requiredSkills && placement.requiredSkills.length > 0 && (
                    <div className="mt-4">
                      <span className="text-gray-500 text-sm">Required Skills:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {placement.requiredSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">Add New Placement Drive</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Google, Microsoft, TCS"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Branch *</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., CSE, IT, ECE"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Academic Year *</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="2020"
                    max="2030"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">CTC/Package *</label>
                  <input
                    type="text"
                    value={formData.ctc}
                    onChange={(e) => setFormData({...formData, ctc: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 12 LPA, 15 LPA"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Job Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Brief description of the role and responsibilities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Required Skills *</label>
                <input
                  type="text"
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="React, Node.js, Python, DSA, DBMS (comma separated)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Eligible Branches *</label>
                <input
                  type="text"
                  value={formData.eligibleBranches}
                  onChange={(e) => setFormData({...formData, eligibleBranches: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="CSE, IT, ECE, EEE (comma separated)"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Separate branches with commas</p>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('records');
                  }}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingPlacement ? 'Update Placement' : 'Add Placement'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Edit Placement</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company *</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Branch *</label>
                    <input
                      type="text"
                      value={formData.branch}
                      onChange={(e) => setFormData({...formData, branch: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Year *</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">CTC *</label>
                    <input
                      type="text"
                      value={formData.ctc}
                      onChange={(e) => setFormData({...formData, ctc: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Required Skills *</label>
                  <input
                    type="text"
                    value={formData.requiredSkills}
                    onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Eligible Branches *</label>
                  <input
                    type="text"
                    value={formData.eligibleBranches}
                    onChange={(e) => setFormData({...formData, eligibleBranches: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Update Placement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPlacements;