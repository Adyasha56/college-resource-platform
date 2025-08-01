import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Loader
} from 'lucide-react';
import axios from 'axios';

const QuestionPapers = () => {
  const [questionPapers, setQuestionPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
      const response = await axios.get('http://localhost:5000/api/questionpapers');
      
      if (response.data.success) {
        setQuestionPapers(response.data.data);
        setFilteredPapers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching question papers:', error);
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

  const downloadPaper = (paper) => {
    window.open(paper.fileUrl, '_blank');
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Question Papers</h1>
          <p className="text-gray-600">Access previous year question papers for your studies</p>
        </div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
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
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPapers.length} of {questionPapers.length} question papers
          </p>
        </div>

        {/* Question Papers Grid */}
        {filteredPapers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Question Papers Found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper, index) => (
              <motion.div
                key={paper._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => openModal(paper)}
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
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
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

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(paper);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadPaper(paper);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && selectedPaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
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
                    onClick={() => downloadPaper(selectedPaper)}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Paper</span>
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default QuestionPapers;