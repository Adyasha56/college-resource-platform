// src/pages/Placements.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Placements = () => {
  const [placements, setPlacements] = useState([]);
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsPlacement, setDetailsPlacement] = useState(null);

  const openDetailsModal = (placement) => {
    setDetailsPlacement(placement);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setDetailsPlacement(null);
  };

 useEffect(() => {
  const fetchPlacements = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/placements`); 
      const data = await res.json();
      setPlacements(data);
    } catch (err) {
      console.error('Failed to fetch placements', err);
    }
  };
  fetchPlacements();
}, []);

  const openQuestionsModal = (placement) => {
    setSelectedPlacement(placement);
    setShowQuestionsModal(true);
  };

  const closeQuestionsModal = () => {
    setShowQuestionsModal(false);
    setSelectedPlacement(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-900">
        Placement Records
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
        {placements.map((item, index) => (
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-28 sm:h-32 flex flex-col items-center justify-center text-white px-4 text-center">
              <span className="font-semibold text-lg sm:text-xl">{item.company}</span>
              <span className="text-blue-100 text-sm mt-1">{item.year}</span>
            </div>
            <div className="p-3 sm:p-4">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-blue-800">
                {item.company}
              </h2>
              <p className="text-gray-700 text-xs sm:text-sm line-clamp-2">{item.description}</p>

              {/* Placement Statistics */}
              <div className="mt-3 grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-bold text-blue-600">{item.studentsApplied || 0}</p>
                  <p className="text-xs text-gray-500">Applied</p>
                </div>
                <div className="text-center border-x border-gray-200">
                  <p className="text-lg sm:text-xl font-bold text-green-600">{item.studentsPlaced || 0}</p>
                  <p className="text-xs text-gray-500">Placed</p>
                </div>
                <div className="text-center">
                  <p className="text-lg sm:text-xl font-bold text-purple-600">
                    {item.studentsApplied > 0 
                      ? ((item.studentsPlaced / item.studentsApplied) * 100).toFixed(0) 
                      : 0}%
                  </p>
                  <p className="text-xs text-gray-500">Rate</p>
                </div>
              </div>

              <ul className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 space-y-1">
                <li>
                  <strong>Branch:</strong> {item.branch}
                </li>
                <li>
                  <strong>CTC:</strong> <span className="text-green-600 font-semibold">{item.ctc}</span>
                </li>
                <li className="break-words">
                  <strong>Eligible:</strong>{" "}
                  {item.eligibleBranches?.join(", ")}
                </li>
              </ul>

              {/* Required Skills */}
              {item.requiredSkills && item.requiredSkills.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.requiredSkills.slice(0, 4).map((skill, i) => (
                      <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                    {item.requiredSkills.length > 4 && (
                      <span className="text-gray-500 text-xs">+{item.requiredSkills.length - 4} more</span>
                    )}
                  </div>
                </div>
              )}

              {/* Students Selected Section */}
              {item.studentsSelected && item.studentsSelected.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium text-gray-800 text-sm">
                    🎉 Students Selected:
                  </p>
                  <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-gray-700 max-h-20 overflow-y-auto">
                    {item.studentsSelected.slice(0, 3).map((stu, i) => (
                      <li key={i} className="break-words">
                        {stu.name} ({stu.branch}) - {stu.package}
                      </li>
                    ))}
                    {item.studentsSelected.length > 3 && (
                      <li className="text-gray-500">+{item.studentsSelected.length - 3} more</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2 justify-between items-center text-sm">
                <div className="flex gap-2">
                  <button
                    onClick={() => openDetailsModal(item)}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition font-medium"
                  >
                    View Details
                  </button>
                  {item.interviewQuestions && item.interviewQuestions.length > 0 && (
                    <button
                      onClick={() => openQuestionsModal(item)}
                      className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 transition font-medium"
                    >
                      Questions ({item.interviewQuestions.length})
                    </button>
                  )}
                </div>
                <span className="text-gray-400 text-xs">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View Details Modal */}
      <AnimatePresence>
        {showDetailsModal && detailsPlacement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeDetailsModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{detailsPlacement.company}</h2>
                    <p className="text-blue-100 mt-1">{detailsPlacement.branch} • {detailsPlacement.year}</p>
                    <div className="flex gap-3 mt-3 text-sm">
                      <span className="bg-white/20 px-3 py-1 rounded-full">
                        CTC: {detailsPlacement.ctc}
                      </span>
                      <span className="bg-white/20 px-3 py-1 rounded-full">
                        {detailsPlacement.studentsPlaced || 0} Placed / {detailsPlacement.studentsApplied || 0} Applied
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeDetailsModal}
                    className="text-white/80 hover:text-white text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Details Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                {/* Description */}
                {detailsPlacement.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Job Description
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                      {detailsPlacement.description}
                    </p>
                  </div>
                )}

                {/* Eligible Branches */}
                {detailsPlacement.eligibleBranches && detailsPlacement.eligibleBranches.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Eligible Branches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {detailsPlacement.eligibleBranches.map((branch, i) => (
                        <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {branch}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Required Skills */}
                {detailsPlacement.requiredSkills && detailsPlacement.requiredSkills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {detailsPlacement.requiredSkills.map((skill, i) => (
                        <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Placement Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    Placement Statistics
                  </h3>
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{detailsPlacement.studentsApplied || 0}</p>
                      <p className="text-sm text-gray-500">Applied</p>
                    </div>
                    <div className="text-center border-x border-gray-200">
                      <p className="text-2xl font-bold text-green-600">{detailsPlacement.studentsPlaced || 0}</p>
                      <p className="text-sm text-gray-500">Placed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {detailsPlacement.studentsApplied > 0 
                          ? ((detailsPlacement.studentsPlaced / detailsPlacement.studentsApplied) * 100).toFixed(0) 
                          : 0}%
                      </p>
                      <p className="text-sm text-gray-500">Selection Rate</p>
                    </div>
                  </div>
                </div>

                {/* Students Selected */}
                {detailsPlacement.studentsSelected && detailsPlacement.studentsSelected.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      🎉 Students Selected ({detailsPlacement.studentsSelected.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {detailsPlacement.studentsSelected.map((stu, i) => (
                        <div key={i} className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="font-medium text-gray-800">{stu.name}</p>
                          <p className="text-sm text-gray-600">{stu.branch} - {stu.package}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interview Questions Preview */}
                {detailsPlacement.interviewQuestions && detailsPlacement.interviewQuestions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      Interview Questions ({detailsPlacement.interviewQuestions.length})
                    </h3>
                    <button
                      onClick={() => {
                        closeDetailsModal();
                        openQuestionsModal(detailsPlacement);
                      }}
                      className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition font-medium w-full"
                    >
                      View All Interview Questions →
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t p-4 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  Posted on {new Date(detailsPlacement.createdAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interview Questions Modal - Glassdoor Style */}
      <AnimatePresence>
        {showQuestionsModal && selectedPlacement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeQuestionsModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPlacement.company}</h2>
                    <p className="text-purple-100 mt-1">Interview Questions • {selectedPlacement.year}</p>
                    <div className="flex gap-4 mt-3 text-sm">
                      <span className="bg-white/20 px-3 py-1 rounded-full">
                        {selectedPlacement.interviewQuestions?.length || 0} Questions
                      </span>
                      <span className="bg-white/20 px-3 py-1 rounded-full">
                        {selectedPlacement.studentsPlaced || 0} Placed / {selectedPlacement.studentsApplied || 0} Applied
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeQuestionsModal}
                    className="text-white/80 hover:text-white text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Questions Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Group questions by round */}
                {['Aptitude', 'Coding', 'Technical', 'HR', 'Group Discussion', 'Other'].map(round => {
                  const roundQuestions = selectedPlacement.interviewQuestions?.filter(q => q.round === round) || [];
                  if (roundQuestions.length === 0) return null;
                  
                  return (
                    <div key={round} className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                        {round} Round ({roundQuestions.length})
                      </h3>
                      <div className="space-y-3">
                        {roundQuestions.map((q, index) => (
                          <div 
                            key={index} 
                            className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500 hover:shadow-md transition"
                          >
                            <p className="text-gray-800 font-medium">{q.question}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                                {q.category}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(q.difficulty)}`}>
                                {q.difficulty}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* No questions fallback */}
                {(!selectedPlacement.interviewQuestions || selectedPlacement.interviewQuestions.length === 0) && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-4xl mb-4">📝</p>
                    <p>No interview questions available for this company yet.</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t p-4 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  These questions were asked during previous placement drives. Use them to prepare!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Placements;
