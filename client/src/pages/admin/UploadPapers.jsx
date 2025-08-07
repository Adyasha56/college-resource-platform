import { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Check, 
  X, 
  Loader, 
  Settings, 
  Trash2, 
  Eye,
  Calendar,
  BookOpen,
  GraduationCap,
  Search,
  Download
} from 'lucide-react';

const UploadPapers = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [formData, setFormData] = useState({
    year: '',
    semester: '',
    branch: '',
    examType: '',
    subject: '',
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dragActive, setDragActive] = useState(false);
  
  // Manage Papers State
  const [managePapers, setManagePapers] = useState([]);
  const [filteredManagePapers, setFilteredManagePapers] = useState([]);
  const [manageLoading, setManageLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [manageFilters, setManageFilters] = useState({
    year: '',
    semester: '',
    branch: '',
    examType: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paperToDelete, setPaperToDelete] = useState(null);

  const branches = [
    'Computer Science Engineering',
    'Electronics and Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology',
    'Other'
  ];

  const examTypes = ['modular', 'end semester'];
  const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchManagePapers();
    }
  }, [activeTab]);

  useEffect(() => {
    filterManagePapers();
  }, [managePapers, searchTerm, manageFilters]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchManagePapers = async () => {
    try {
      setManageLoading(true);
      const token = localStorage.getItem('adminToken');
      
      console.log('🔍 Fetching papers from: http://localhost:5000/api/questionpapers');
      
      const response = await fetch('http://localhost:5000/api/questionpapers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📨 Fetch response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📨 Fetch response data:', data);

      if (data.success) {
        setManagePapers(data.data || []);
      } else {
        console.log('📝 No papers found or API returned error');
        setManagePapers([]);
      }
    } catch (error) {
      console.error('Error fetching papers:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error fetching papers for management' 
      });
      setManagePapers([]);
    } finally {
      setManageLoading(false);
    }
  };

  const filterManagePapers = () => {
    let filtered = managePapers.filter(paper => {
      const matchesSearch = 
        paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.branch.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesYear = !manageFilters.year || paper.year.toString() === manageFilters.year;
      const matchesSemester = !manageFilters.semester || paper.semester.toString() === manageFilters.semester;
      const matchesBranch = !manageFilters.branch || paper.branch === manageFilters.branch;
      const matchesExamType = !manageFilters.examType || paper.examType === manageFilters.examType;

      return matchesSearch && matchesYear && matchesSemester && matchesBranch && matchesExamType;
    });

    // Group by year for better organization
    const groupedByYear = filtered.reduce((acc, paper) => {
      const year = paper.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(paper);
      return acc;
    }, {});

    setFilteredManagePapers(groupedByYear);
  };

  const handleManageFilterChange = (filterType, value) => {
    setManageFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearManageFilters = () => {
    setManageFilters({
      year: '',
      semester: '',
      branch: '',
      examType: '',
    });
    setSearchTerm('');
  };

  const handleDeleteClick = (paper) => {
    setPaperToDelete(paper);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!paperToDelete) return;

    try {
      const token = localStorage.getItem('adminToken');
      
      console.log('🗑️ Deleting paper:', paperToDelete._id);
      
      const response = await fetch(
        `http://localhost:5000/api/questionpapers/delete/${paperToDelete._id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      console.log('🗑️ Delete response:', data);

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message || 'Question paper deleted successfully!' });
        fetchManagePapers(); // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to delete paper');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error deleting question paper' 
      });
    } finally {
      setShowDeleteModal(false);
      setPaperToDelete(null);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/msword' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
        setMessage({ type: '', text: '' });
      } else {
        setMessage({ type: 'error', text: 'Please select a PDF or Word document' });
        setFile(null);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || 
          droppedFile.type === 'application/msword' || 
          droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(droppedFile);
        setMessage({ type: '', text: '' });
      } else {
        setMessage({ type: 'error', text: 'Please select a PDF or Word document' });
      }
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!file || !formData.year || !formData.semester || !formData.branch || !formData.examType || !formData.subject) {
      setMessage({ type: 'error', text: 'Please fill all fields and select a file' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const token = localStorage.getItem('adminToken');
      console.log('🔍 Uploading with token:', token);
      
      const uploadFormData = new FormData();
      uploadFormData.append('questionPaper', file); // Your backend expects 'questionPaper'
      uploadFormData.append('year', formData.year);
      uploadFormData.append('semester', formData.semester);
      uploadFormData.append('branch', formData.branch);
      uploadFormData.append('examType', formData.examType);
      uploadFormData.append('subject', formData.subject);

      console.log('📤 Uploading to: http://localhost:5000/api/questionpapers/add');

      const response = await fetch('http://localhost:5000/api/questionpapers/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      });

      console.log('📨 Response status:', response.status);
      console.log('📨 Response headers:', response.headers);

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('📨 Response data:', data);
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned invalid response format');
      }

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message || 'Question paper uploaded successfully!' });
        
        // Reset form
        setFormData({
          year: '',
          semester: '',
          branch: '',
          examType: '',
          subject: '',
        });
        setFile(null);
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        
      } else {
        throw new Error(data.message || data.error || 'Upload failed');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      
      // More specific error messages
      let errorMessage = 'Error uploading question paper';
      
      if (error.message.includes('404')) {
        errorMessage = 'Upload API endpoint not found. Please contact administrator.';
      } else if (error.message.includes('Unexpected token')) {
        errorMessage = 'Server error: Invalid response format. Please try again.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Unable to connect to server.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Unauthorized: Please login again.';
      } else if (error.message.includes('403')) {
        errorMessage = 'Access denied: Admin privileges required.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const viewPaper = async (paper) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Since your route is /:id, use the paper ID directly
      const response = await fetch(`http://localhost:5000/api/questionpapers/${paper._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.fileUrl) {
          // Open the Cloudinary URL directly
          window.open(data.data.fileUrl, '_blank');
        } else {
          throw new Error('File URL not found');
        }
      } else {
        throw new Error('Failed to view paper');
      }
    } catch (error) {
      console.error('View error:', error);
      setMessage({ type: 'error', text: 'Error viewing question paper' });
    }
  };

  const downloadPaper = async (paper) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Get paper details first
      const response = await fetch(`http://localhost:5000/api/questionpapers/${paper._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.fileUrl) {
          // Create download link from Cloudinary URL
          const link = document.createElement('a');
          link.href = data.data.fileUrl;
          link.download = `${paper.subject}_${paper.examType}_${paper.year}.pdf`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          throw new Error('File URL not found');
        }
      } else {
        throw new Error('Failed to download paper');
      }
    } catch (error) {
      console.error('Download error:', error);
      setMessage({ type: 'error', text: 'Error downloading question paper' });
    }
  };

  // Tab content components
  const UploadTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Upload className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Upload Question Paper</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Semester</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
              <select
                name="examType"
                value={formData.examType}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Exam Type</option>
                {examTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter subject name"
                required
              />
            </div>
          </div>

          {/* File Upload Area */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : file 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-2">
                  <Check className="h-8 w-8 text-green-600 mx-auto" />
                  <p className="text-sm text-green-600 font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">File selected successfully</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      const fileInput = document.querySelector('input[type="file"]');
                      if (fileInput) fileInput.value = '';
                    }}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">
                    Drag and drop your file here, or{' '}
                    <label className="text-blue-600 cursor-pointer hover:text-blue-700">
                      browse
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX files only</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Question Paper
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const ManageTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Manage Question Papers</h2>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by subject or branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={manageFilters.year}
              onChange={(e) => handleManageFilterChange('year', e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={manageFilters.semester}
              onChange={(e) => handleManageFilterChange('semester', e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Semesters</option>
              {semesters.map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>

            <select
              value={manageFilters.branch}
              onChange={(e) => handleManageFilterChange('branch', e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>

            <select
              value={manageFilters.examType}
              onChange={(e) => handleManageFilterChange('examType', e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Exam Types</option>
              {examTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>

          <button
            onClick={clearManageFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all filters
          </button>
        </div>

        {/* Papers List */}
        {manageLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-6 w-6 animate-spin text-blue-600 mr-2" />
            <span>Loading papers...</span>
          </div>
        ) : Object.keys(filteredManagePapers).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No question papers found</p>
            <p className="text-sm mt-2">Upload some papers to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(filteredManagePapers)
              .sort(([a], [b]) => parseInt(b) - parseInt(a))
              .map(([year, papers]) => (
              <div key={year} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Year {year}
                </h3>
                <div className="grid gap-4">
                  {papers.map((paper) => (
                    <div key={paper._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                            {paper.subject}
                          </h4>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p className="flex items-center">
                              <GraduationCap className="h-4 w-4 mr-2" />
                              {paper.branch}
                            </p>
                            <p>Semester {paper.semester} • {paper.examType.charAt(0).toUpperCase() + paper.examType.slice(1)}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded: {new Date(paper.createdAt || paper.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewPaper(paper)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="View Paper"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => downloadPaper(paper)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                            title="Download Paper"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(paper)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Paper"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Question Papers Management</h1>
          <p className="mt-2 text-gray-600">Upload and manage question papers for students</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? 
                <Check className="h-4 w-4 mr-2" /> : 
                <X className="h-4 w-4 mr-2" />
              }
              {message.text}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
                  activeTab === 'upload'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Upload className="h-4 w-4 inline mr-2" />
                Upload Papers
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
                  activeTab === 'manage'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Manage Papers
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'upload' ? <UploadTab /> : <ManageTab />}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the question paper for "{paperToDelete?.subject}"? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPapers;