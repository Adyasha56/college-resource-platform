import { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  BookOpen, 
  GraduationCap,
  Eye,
  X,
  Loader,
  AlertTriangle
} from 'lucide-react';

const QuestionPapers = () => {
  const [questionPapers, setQuestionPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [debugInfo, setDebugInfo] = useState(''); // Debug information
  const [filters, setFilters] = useState({
    year: '',
    semester: '',
    branch: '',
    examType: '',
  });
  const [showFilters, setShowFilters] = useState(false);

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

  useEffect(() => {
    fetchQuestionPapers();
  }, []);

  useEffect(() => {
    filterPapers();
  }, [questionPapers, searchTerm, filters]);

  const fetchQuestionPapers = async () => {
    try {
      setIsLoading(true);
      
      // Using fetch instead of axios for better compatibility
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/questionpapers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setQuestionPapers(data.data);
        setFilteredPapers(data.data);
        setDebugInfo(`✅ Loaded ${data.data.length} question papers`);
      } else {
        setDebugInfo('❌ Failed to fetch papers: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching question papers:', error);
      setDebugInfo('❌ Network error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPapers = () => {
    let filtered = questionPapers.filter(paper => {
      const matchesSearch = 
        paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.branch.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesYear = !filters.year || paper.year.toString() === filters.year;
      const matchesSemester = !filters.semester || paper.semester.toString() === filters.semester;
      const matchesBranch = !filters.branch || paper.branch === filters.branch;
      const matchesExamType = !filters.examType || paper.examType === filters.examType;

      return matchesSearch && matchesYear && matchesSemester && matchesBranch && matchesExamType;
    });

    setFilteredPapers(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      year: '',
      semester: '',
      branch: '',
      examType: '',
    });
    setSearchTerm('');
  };

  const openModal = (paper) => {
    setSelectedPaper(paper);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPaper(null);
  };

  // IMPROVED DOWNLOAD FUNCTION WITH CORRECT ENDPOINT
  const handleDownload = async (paper) => {
    console.log('🔍 Starting download process for:', paper.subject);
    
    // Check for authentication token
    const userToken = localStorage.getItem('userToken') || 
                     localStorage.getItem('token') || 
                     localStorage.getItem('studentToken') ||
                     localStorage.getItem('authToken');
    
    if (!userToken) {
      console.log('❌ No authentication token found');
      setDebugInfo('❌ Authentication required - please login');
      setAuthError(true);
      return;
    }

    try {
      setDownloadLoading(true);
      setDebugInfo('🔄 Attempting secure download...');
      
      // YOUR ACTUAL API ENDPOINTS (matching your backend routes)
      const endpoints = [
        `${import.meta.env.VITE_BACKEND_URL}/api/download/questionpaper/${paper._id}`, // Your actual route
        `${import.meta.env.VITE_BACKEND_URL}/api/questionpapers/${paper._id}`, // Alternative
      ];

      let downloadSuccess = false;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Trying endpoint: ${endpoint}`);
          setDebugInfo(`🔄 Trying: ${endpoint.includes('/download/') ? 'download endpoint' : 'alternative endpoint'}`);
          
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Accept': 'application/octet-stream, application/pdf, */*'
            }
          });

          console.log(`📊 Response status: ${response.status} for ${endpoint}`);

          if (response.ok) {
            // Check if it's a file download or JSON response
            const contentType = response.headers.get('content-type');
            
            if (contentType && (contentType.includes('application/pdf') || contentType.includes('application/octet-stream'))) {
              // It's a file download
              const blob = await response.blob();
              const fileName = `${paper.subject.replace(/[^a-zA-Z0-9\s]/g, '')}_${paper.examType}_Year${paper.year}_Sem${paper.semester}.pdf`;
              
              // Create download link
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
              
              setDebugInfo('✅ Download completed successfully!');
              downloadSuccess = true;
              break;
            } else {
              // It's probably JSON data, get the fileUrl and download directly
              const data = await response.json();
              if (data.success && data.data && data.data.fileUrl) {
                console.log('📄 Got paper data, trying direct download from fileUrl');
                setDebugInfo('🔄 Got file URL, downloading directly...');
                await downloadDirectly({ ...paper, fileUrl: data.data.fileUrl });
                downloadSuccess = true;
                break;
              }
            }
          } else {
            const errorData = await response.text();
            console.log(`❌ Endpoint ${endpoint} returned ${response.status}: ${errorData}`);
            lastError = new Error(`${response.status}: ${errorData}`);
          }
        } catch (endpointError) {
          console.log(`❌ Endpoint ${endpoint} failed:`, endpointError.message);
          lastError = endpointError;
          continue;
        }
      }

      // If all API endpoints fail, try direct Cloudinary download
      if (!downloadSuccess) {
        console.log('🔄 All API endpoints failed, trying direct download');
        setDebugInfo('🔄 API failed, trying direct file access...');
        await downloadDirectly(paper);
      }

    } catch (error) {
      console.error('❌ Download process failed:', error);
      
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        setAuthError(true);
        setDebugInfo('❌ Authentication failed - please login again');
      } else {
        setDebugInfo('❌ Download failed: ' + error.message);
        // Try direct download as final fallback
        await downloadDirectly(paper);
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  // Direct download from Cloudinary with improved URL fixes
  const downloadDirectly = async (paper) => {
    try {
      if (!paper.fileUrl) {
        throw new Error('No file URL available');
      }

      let fileUrl = paper.fileUrl;
      console.log('🔍 Original URL:', fileUrl);
      
      // Fix Cloudinary URL issues
      if (fileUrl.includes('cloudinary.com')) {
        // Handle the specific URL structure from your logs
        // URL format: https://res.cloudinary.com/dvg6kkxr3/raw/upload/v1754237954/question-papers/JS%20Part2%20%28Qs%29-1754237938720
        
        // Check if it's missing .pdf extension
        if (!fileUrl.match(/\.(pdf|doc|docx)$/i)) {
          // Add .pdf extension
          fileUrl = fileUrl + '.pdf';
          console.log('🔧 Added .pdf extension:', fileUrl);
        }
        
        // Try different URL variations
        const urlVariations = [
          fileUrl, // Original with .pdf added
          fileUrl.replace('/raw/', '/image/'), // Try image delivery instead of raw
          fileUrl.replace('dvg6kkxr3', 'dvg6kkxr3'), // Keep same cloud name but try different approach
        ];
        
        setDebugInfo('🔧 Trying direct file access...');
        
        for (const tryUrl of urlVariations) {
          try {
            console.log('🔍 Trying URL variation:', tryUrl);
            
            const response = await fetch(tryUrl, {
              method: 'GET',
              mode: 'cors',
              headers: {
                'Accept': 'application/pdf, application/octet-stream, */*'
              }
            });

            if (response.ok) {
              const blob = await response.blob();
              
              // Verify we got a proper file (not HTML error page)
              if (blob.size > 1000) { // Assume files are larger than 1KB
                const fileName = `${paper.subject.replace(/[^a-zA-Z0-9\s]/g, '')}_${paper.examType}_Year${paper.year}_Sem${paper.semester}.pdf`;
                
                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                setDebugInfo('✅ Direct download completed!');
                return; // Success, exit function
              }
            }
          } catch (fetchError) {
            console.log('❌ URL variation failed:', tryUrl, fetchError.message);
            continue;
          }
        }
      }

      // If all Cloudinary attempts fail, try opening in new tab
      console.log('🔄 All download attempts failed, opening in new tab');
      setDebugInfo('🔄 Opening file in new tab...');
      
      // Try original URL first, then with .pdf extension
      const fallbackUrls = [
        paper.fileUrl,
        paper.fileUrl + '.pdf'
      ];
      
      // Open the first URL in a new tab
      window.open(fallbackUrls[0], '_blank');
      setDebugInfo('✅ File opened in new tab - check your downloads or new tab');

    } catch (error) {
      console.error('❌ Direct download failed:', error);
      setDebugInfo('❌ Direct download failed: ' + error.message);
      
      // Final last resort
      if (paper.fileUrl) {
        const userConfirm = confirm('Download failed. Would you like to try opening the file URL directly?');
        if (userConfirm) {
          window.open(paper.fileUrl, '_blank');
          setDebugInfo('⚠️ Opened original URL - check your browser downloads');
        }
      } else {
        alert('Sorry, unable to download this file. Please contact support.');
        setDebugInfo('❌ No file URL available');
      }
    }
  };

  const handleAuthErrorClose = () => {
    setAuthError(false);
  };

  const redirectToLogin = () => {
    setAuthError(false);
    window.location.href = '/login';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading question papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Question Papers</h1>
          <p className="text-gray-600">Access previous year question papers for your studies</p>
          
          {/* Debug Info - Enhanced */}
          {debugInfo && (
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg text-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="text-blue-600 font-medium">Download Status:</div>
                    {downloadLoading && <Loader className="w-4 h-4 animate-spin ml-2 text-blue-500" />}
                  </div>
                  <div className="text-blue-800 whitespace-pre-line">{debugInfo}</div>
                </div>
                <button 
                  onClick={() => setDebugInfo('')}
                  className="ml-4 text-blue-400 hover:text-blue-600 p-1 rounded flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by subject or branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-4 py-3 text-blue-600 hover:text-blue-800 transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Year Filter */}
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>

                {/* Semester Filter */}
                <select
                  value={filters.semester}
                  onChange={(e) => handleFilterChange('semester', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Semesters</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                  <option value="7">7th Semester</option>
                  <option value="8">8th Semester</option>
                </select>

                {/* Branch Filter */}
                <select
                  value={filters.branch}
                  onChange={(e) => handleFilterChange('branch', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>

                {/* Exam Type Filter */}
                <select
                  value={filters.examType}
                  onChange={(e) => handleFilterChange('examType', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Exam Types</option>
                  {examTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPapers.length} of {questionPapers.length} question papers
          </p>
        </div>

        {/* Question Papers Grid */}
        {filteredPapers.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Question Papers Found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper, index) => (
              <div
                key={paper._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      paper.examType === 'modular' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {paper.examType === 'modular' ? 'Modular' : 'End Semester'}
                    </span>
                  </div>

                  {/* Subject */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {paper.subject}
                  </h3>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      <span>{paper.branch}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span>Year {paper.year} - Semester {paper.semester}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Uploaded {formatDate(paper.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions - Simplified */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(paper)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => handleDownload(paper)}
                      disabled={downloadLoading}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadLoading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && selectedPaper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {selectedPaper.subject}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedPaper.examType === 'modular' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {selectedPaper.examType === 'modular' ? 'Modular Exam' : 'End Semester Exam'}
                    </span>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Academic Year</p>
                      <p className="font-semibold">{selectedPaper.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Semester</p>
                      <p className="font-semibold">{selectedPaper.semester}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Branch</p>
                      <p className="font-semibold">{selectedPaper.branch}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Uploaded On</p>
                      <p className="font-semibold">{formatDate(selectedPaper.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleDownload(selectedPaper)}
                    disabled={downloadLoading}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download Paper</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Authentication Error Modal */}
        {authError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                {/* Error Icon */}
                <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                
                {/* Close Button */}
                <button
                  onClick={handleAuthErrorClose}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                
                {/* Error Content */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">Authentication Required</h3>
                <p className="text-gray-600 mb-6">
                  You need to login to download question papers. Please login to continue.
                </p>
                
                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleAuthErrorClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={redirectToLogin}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Login Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPapers;