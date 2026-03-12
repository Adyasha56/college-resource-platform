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
    studentsSelected: [],
    studentsApplied: 0,
    studentsPlaced: 0,
    interviewQuestions: []
  });

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    round: 'Technical',
    category: 'General',
    difficulty: 'Medium'
  });

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
        studentsSelected: formData.studentsSelected || [],
        studentsApplied: parseInt(formData.studentsApplied) || 0,
        studentsPlaced: parseInt(formData.studentsPlaced) || 0,
        interviewQuestions: formData.interviewQuestions || []
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
      studentsSelected: placement.studentsSelected || [],
      studentsApplied: placement.studentsApplied || 0,
      studentsPlaced: placement.studentsPlaced || 0,
      interviewQuestions: placement.interviewQuestions || []
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
      studentsSelected: [],
      studentsApplied: 0,
      studentsPlaced: 0,
      interviewQuestions: []
    });
    setNewQuestion({
      question: '',
      round: 'Technical',
      category: 'General',
      difficulty: 'Medium'
    });
    setEditingPlacement(null);
  };

  const addInterviewQuestion = () => {
    if (!newQuestion.question.trim()) return;
    setFormData({
      ...formData,
      interviewQuestions: [...formData.interviewQuestions, { ...newQuestion }]
    });
    setNewQuestion({
      question: '',
      round: 'Technical',
      category: 'General',
      difficulty: 'Medium'
    });
  };

  const removeInterviewQuestion = (index) => {
    setFormData({
      ...formData,
      interviewQuestions: formData.interviewQuestions.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-800 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-4">Placement Management</h1>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-slate-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('records')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'records'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                Placement Records ({placements.length})
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'add'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-slate-600'
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
                <div className="text-gray-500 dark:text-slate-400 text-lg mb-4">No placement records found</div>
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
                  className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md dark:shadow-slate-900 border border-gray-200 dark:border-slate-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">{placement.company}</h3>
                      <p className="text-blue-600 font-medium">{placement.branch}</p>
                      <p className="text-gray-600 dark:text-slate-300 mt-1">{placement.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(placement)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
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
                      <span className="text-gray-500 dark:text-slate-400 text-sm">Branch:</span>
                      <p className="font-semibold">{placement.branch}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-slate-400 text-sm">Year:</span>
                      <p className="font-semibold">{placement.year}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-slate-400 text-sm">CTC:</span>
                      <p className="font-semibold text-green-600">{placement.ctc}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-slate-400 text-sm">Students Selected:</span>
                      <p className="font-semibold text-blue-600">
                        {placement.studentsSelected?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Placement Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-4 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{placement.studentsApplied || 0}</p>
                      <p className="text-sm text-gray-700">Students Applied</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{placement.studentsPlaced || 0}</p>
                      <p className="text-sm text-gray-700">Students Placed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {placement.studentsApplied > 0
                          ? ((placement.studentsPlaced / placement.studentsApplied) * 100).toFixed(1)
                          : 0}%
                      </p>
                      <p className="text-sm text-gray-700">Selection Rate</p>
                    </div>
                  </div>

                  {/* Interview Questions Section */}
                  {placement.interviewQuestions && placement.interviewQuestions.length > 0 && (
                    <div className="mt-4 p-4 bg-purple-50 dark:bg-slate-800 rounded-lg border border-purple-200 dark:border-slate-700">
                      <h4 className="font-semibold text-purple-800 mb-3">
                        📝 Interview Questions ({placement.interviewQuestions.length})
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {placement.interviewQuestions.map((q, index) => (
                          <div key={index} className="bg-white dark:bg-slate-900 p-3 rounded border dark:border-slate-700 text-sm">
                            <p className="font-medium text-gray-800 dark:text-slate-100">{q.question}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{q.round}</span>
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{q.category}</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                q.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>{q.difficulty}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <span className="text-gray-500 dark:text-slate-400 text-sm">Eligible Branches:</span>
                    <p className="text-sm">{placement.eligibleBranches?.join(', ')}</p>
                  </div>

                  {/* Students Selected Section */}
                  {placement.studentsSelected && placement.studentsSelected.length > 0 && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-slate-800 rounded-lg border border-green-200 dark:border-slate-700">
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
                      <span className="text-gray-500 dark:text-slate-400 text-sm">Required Skills:</span>
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
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md dark:shadow-slate-900">
            <h2 className="text-xl font-bold dark:text-white mb-6">Add New Placement Drive</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium dark:text-slate-200 mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Google, Microsoft, TCS"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-slate-200 mb-2">Branch *</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., CSE, IT, ECE"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-slate-200 mb-2">Academic Year *</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="2020"
                    max="2030"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-slate-200 mb-2">CTC/Package *</label>
                  <input
                    type="text"
                    value={formData.ctc}
                    onChange={(e) => setFormData({...formData, ctc: e.target.value})}
                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 12 LPA, 15 LPA"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-slate-200 mb-2">Job Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Brief description of the role and responsibilities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-slate-200 mb-2">Required Skills *</label>
                <input
                  type="text"
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="React, Node.js, Python, DSA, DBMS (comma separated)"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Separate skills with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-slate-200 mb-2">Eligible Branches *</label>
                <input
                  type="text"
                  value={formData.eligibleBranches}
                  onChange={(e) => setFormData({...formData, eligibleBranches: e.target.value})}
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="CSE, IT, ECE, EEE (comma separated)"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Separate branches with commas</p>
              </div>

              {/* Placement Statistics */}
              <div className="border-t dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-200">📊 Placement Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium dark:text-slate-200 mb-2">Students Applied</label>
                    <input
                      type="number"
                      value={formData.studentsApplied}
                      onChange={(e) => setFormData({...formData, studentsApplied: parseInt(e.target.value) || 0})}
                      className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      placeholder="e.g., 150"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium dark:text-slate-200 mb-2">Students Placed</label>
                    <input
                      type="number"
                      value={formData.studentsPlaced}
                      onChange={(e) => setFormData({...formData, studentsPlaced: parseInt(e.target.value) || 0})}
                      className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      placeholder="e.g., 25"
                    />
                  </div>
                </div>
              </div>

              {/* Interview Questions Section */}
              <div className="border-t dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-slate-200">📝 Interview Questions (Like Glassdoor)</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Add questions that were asked during the interview process</p>

                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium dark:text-slate-200 mb-2">Question</label>
                      <textarea
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                        placeholder="e.g., Explain the difference between HashMap and HashTable in Java"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-slate-200 mb-2">Round</label>
                      <select
                        value={newQuestion.round}
                        onChange={(e) => setNewQuestion({...newQuestion, round: e.target.value})}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Aptitude">Aptitude</option>
                        <option value="Technical">Technical</option>
                        <option value="HR">HR</option>
                        <option value="Coding">Coding</option>
                        <option value="Group Discussion">Group Discussion</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-slate-200 mb-2">Category</label>
                      <select
                        value={newQuestion.category}
                        onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="DSA">DSA</option>
                        <option value="DBMS">DBMS</option>
                        <option value="OS">OS</option>
                        <option value="CN">Computer Networks</option>
                        <option value="OOPs">OOPs</option>
                        <option value="Web Dev">Web Development</option>
                        <option value="System Design">System Design</option>
                        <option value="Behavioral">Behavioral</option>
                        <option value="Puzzle">Puzzle</option>
                        <option value="General">General</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-slate-200 mb-2">Difficulty</label>
                      <select
                        value={newQuestion.difficulty}
                        onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addInterviewQuestion}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm"
                  >
                    + Add Question
                  </button>
                </div>

                {/* Display Added Questions */}
                {formData.interviewQuestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Added Questions ({formData.interviewQuestions.length}):</p>
                    {formData.interviewQuestions.map((q, index) => (
                      <div key={index} className="flex items-start justify-between bg-white dark:bg-slate-900 p-3 rounded-lg border dark:border-slate-700">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{q.question}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{q.round}</span>
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{q.category}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                              q.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>{q.difficulty}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeInterviewQuestion(index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('records');
                  }}
                  className="px-6 py-2 text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-white transition"
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
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold dark:text-white mb-4">Edit Placement</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium dark:text-slate-200 mb-1">Company *</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-slate-200 mb-1">Branch *</label>
                    <input
                      type="text"
                      value={formData.branch}
                      onChange={(e) => setFormData({...formData, branch: e.target.value})}
                      className="w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-slate-200 mb-1">Year *</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                      className="w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-slate-200 mb-1">CTC *</label>
                    <input
                      type="text"
                      value={formData.ctc}
                      onChange={(e) => setFormData({...formData, ctc: e.target.value})}
                      className="w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-slate-200 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-800 dark:text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-slate-200 mb-1">Required Skills *</label>
                  <input
                    type="text"
                    value={formData.requiredSkills}
                    onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
                    className="w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-800 dark:text-white"
                    placeholder="Separate with commas"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-slate-200 mb-1">Eligible Branches *</label>
                  <input
                    type="text"
                    value={formData.eligibleBranches}
                    onChange={(e) => setFormData({...formData, eligibleBranches: e.target.value})}
                    className="w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-800 dark:text-white"
                    placeholder="Separate with commas"
                    required
                  />
                </div>

                {/* Placement Statistics */}
                <div className="border-t dark:border-slate-700 pt-4">
                  <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-slate-200">📊 Placement Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium dark:text-slate-200 mb-1">Students Applied</label>
                      <input
                        type="number"
                        value={formData.studentsApplied}
                        onChange={(e) => setFormData({...formData, studentsApplied: parseInt(e.target.value) || 0})}
                        className="w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-800 dark:text-white"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-slate-200 mb-1">Students Placed</label>
                      <input
                        type="number"
                        value={formData.studentsPlaced}
                        onChange={(e) => setFormData({...formData, studentsPlaced: parseInt(e.target.value) || 0})}
                        className="w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-800 dark:text-white"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Interview Questions Section */}
                <div className="border-t dark:border-slate-700 pt-4">
                  <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-slate-200">📝 Interview Questions</h3>

                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium dark:text-slate-200 mb-1">Question</label>
                        <textarea
                          value={newQuestion.question}
                          onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                          className="w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-900 dark:text-white text-sm"
                          rows={2}
                          placeholder="Enter interview question..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium dark:text-slate-200 mb-1">Round</label>
                        <select
                          value={newQuestion.round}
                          onChange={(e) => setNewQuestion({...newQuestion, round: e.target.value})}
                          className="w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-900 dark:text-white text-sm"
                        >
                          <option value="Aptitude">Aptitude</option>
                          <option value="Technical">Technical</option>
                          <option value="HR">HR</option>
                          <option value="Coding">Coding</option>
                          <option value="Group Discussion">Group Discussion</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium dark:text-slate-200 mb-1">Category</label>
                        <select
                          value={newQuestion.category}
                          onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                          className="w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-900 dark:text-white text-sm"
                        >
                          <option value="DSA">DSA</option>
                          <option value="DBMS">DBMS</option>
                          <option value="OS">OS</option>
                          <option value="CN">Computer Networks</option>
                          <option value="OOPs">OOPs</option>
                          <option value="Web Dev">Web Development</option>
                          <option value="System Design">System Design</option>
                          <option value="Behavioral">Behavioral</option>
                          <option value="Puzzle">Puzzle</option>
                          <option value="General">General</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium dark:text-slate-200 mb-1">Difficulty</label>
                        <select
                          value={newQuestion.difficulty}
                          onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                          className="w-full border dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-900 dark:text-white text-sm"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addInterviewQuestion}
                      className="bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700 transition text-sm"
                    >
                      + Add Question
                    </button>
                  </div>

                  {/* Display Added Questions */}
                  {formData.interviewQuestions.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Added Questions ({formData.interviewQuestions.length}):</p>
                      {formData.interviewQuestions.map((q, index) => (
                        <div key={index} className="flex items-start justify-between bg-white dark:bg-slate-900 p-2 rounded border dark:border-slate-700 text-sm">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{q.question}</p>
                            <div className="flex gap-1 mt-1">
                              <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs">{q.round}</span>
                              <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">{q.category}</span>
                              <span className={`px-1.5 py-0.5 rounded text-xs ${
                                q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                q.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>{q.difficulty}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeInterviewQuestion(index)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-white"
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