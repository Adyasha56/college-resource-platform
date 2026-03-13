import { useEffect, useState, useMemo } from "react";
import {
  Building2,
  Briefcase,
  Users,
  TrendingUp,
  X,
  ChevronLeft,
  ChevronRight,
  Tag,
  Award,
  FileText,
} from "lucide-react";

const ITEMS_PER_PAGE = 9;

const Placements = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // "details" | "questions"
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/placements`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data?.data || [];
        // Newest first
        const sorted = [...arr].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPlacements(sorted);
      } catch (err) {
        console.error("Failed to fetch placements", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlacements();
  }, []);

  const totalPages = Math.max(1, Math.ceil(placements.length / ITEMS_PER_PAGE));
  const paginatedPlacements = placements.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPaginationItems = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
      .reduce((acc, p, idx, arr) => {
        if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
        acc.push(p);
        return acc;
      }, []);

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "Hard":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      default:
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300";
    }
  };

  const openModal = (placement, type) => {
    setSelectedPlacement(placement);
    setActiveModal(type);
  };

  const closeModal = () => {
    setSelectedPlacement(null);
    setActiveModal(null);
  };

  const placementRate = (item) =>
    item.studentsApplied > 0
      ? ((item.studentsPlaced / item.studentsApplied) * 100).toFixed(0)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading placements...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Placement Records
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          {placements.length} company record{placements.length !== 1 ? "s" : ""} — newest first
        </p>
      </div>

      {placements.length === 0 ? (
        <div className="text-center py-16">
          <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-600 dark:text-slate-400 mb-1">
            No placement records yet
          </h3>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedPlacements.map((item) => (
              <div
                key={item._id}
                onClick={() => openModal(item, "details")}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="p-4">
                  {/* Company name + year */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {item.company?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                          {item.company}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{item.year}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                      {item.ctc}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg mb-3">
                    <div className="text-center">
                      <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                        {item.studentsApplied || 0}
                      </p>
                      <p className="text-xs text-slate-400">Applied</p>
                    </div>
                    <div className="text-center border-x border-slate-200 dark:border-slate-700">
                      <p className="text-base font-bold text-green-600 dark:text-green-400">
                        {item.studentsPlaced || 0}
                      </p>
                      <p className="text-xs text-slate-400">Placed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                        {placementRate(item)}%
                      </p>
                      <p className="text-xs text-slate-400">Rate</p>
                    </div>
                  </div>

                  {/* Branch + skills preview */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="font-medium">Branch:</span> {item.branch}
                  </p>

                  {item.requiredSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.requiredSkills.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {item.requiredSkills.length > 3 && (
                        <span className="text-xs text-slate-400">
                          +{item.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openModal(item, "details")}
                        className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                      >
                        Details
                      </button>
                      {item.interviewQuestions?.length > 0 && (
                        <button
                          onClick={() => openModal(item, "questions")}
                          className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
                        >
                          Q&A ({item.interviewQuestions.length})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {getPaginationItems().map((item, idx) =>
                item === "..." ? (
                  <span key={`e-${idx}`} className="px-1 text-slate-400 text-sm">...</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setCurrentPage(item)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === item
                        ? "bg-blue-600 text-white"
                        : "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Details Modal */}
      {activeModal === "details" && selectedPlacement && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-blue-600 p-5 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selectedPlacement.company}</h2>
                  <p className="text-blue-100 text-sm mt-0.5">
                    {selectedPlacement.branch} · {selectedPlacement.year}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full">
                      CTC: {selectedPlacement.ctc}
                    </span>
                    <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full">
                      {selectedPlacement.studentsPlaced || 0} placed / {selectedPlacement.studentsApplied || 0} applied
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedPlacement.studentsApplied || 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Applied</p>
                </div>
                <div className="text-center border-x border-slate-200 dark:border-slate-700">
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {selectedPlacement.studentsPlaced || 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Placed</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-700 dark:text-slate-300">
                    {placementRate(selectedPlacement)}%
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Rate</p>
                </div>
              </div>

              {/* Description */}
              {selectedPlacement.description && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Job Description
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                    {selectedPlacement.description}
                  </p>
                </div>
              )}

              {/* Eligible Branches */}
              {selectedPlacement.eligibleBranches?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-500" />
                    Eligible Branches
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPlacement.eligibleBranches.map((branch, i) => (
                      <span
                        key={i}
                        className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-full"
                      >
                        {branch}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Required Skills */}
              {selectedPlacement.requiredSkills?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-500" />
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPlacement.requiredSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Students Selected */}
              {selectedPlacement.studentsSelected?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Students Selected ({selectedPlacement.studentsSelected.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedPlacement.studentsSelected.map((stu, i) => (
                      <div
                        key={i}
                        className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <p className="text-sm font-medium text-slate-800 dark:text-white">{stu.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {stu.branch} · {stu.package}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interview Questions Link */}
              {selectedPlacement.interviewQuestions?.length > 0 && (
                <button
                  onClick={() => {
                    closeModal();
                    openModal(selectedPlacement, "questions");
                  }}
                  className="w-full py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View Interview Questions ({selectedPlacement.interviewQuestions.length})
                </button>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 px-5 py-3">
              <p className="text-xs text-slate-400 text-center">
                Posted {new Date(selectedPlacement.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interview Questions Modal */}
      {activeModal === "questions" && selectedPlacement && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-800 dark:bg-slate-950 p-5 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selectedPlacement.company}</h2>
                  <p className="text-slate-300 text-sm mt-0.5">
                    Interview Questions · {selectedPlacement.year}
                  </p>
                  <span className="inline-block mt-2 bg-white/10 text-xs px-2.5 py-1 rounded-full">
                    {selectedPlacement.interviewQuestions?.length || 0} Questions
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-5">
              {["Aptitude", "Coding", "Technical", "HR", "Group Discussion", "Other"].map((round) => {
                const roundQs =
                  selectedPlacement.interviewQuestions?.filter((q) => q.round === round) || [];
                if (roundQs.length === 0) return null;
                return (
                  <div key={round}>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
                      {round} Round ({roundQs.length})
                    </h3>
                    <div className="space-y-2">
                      {roundQs.map((q, index) => (
                        <div
                          key={index}
                          className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-lg border-l-4 border-blue-500"
                        >
                          <p className="text-sm text-slate-800 dark:text-white font-medium">
                            {q.question}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                              {q.category}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyStyle(q.difficulty)}`}>
                              {q.difficulty}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {(!selectedPlacement.interviewQuestions ||
                selectedPlacement.interviewQuestions.length === 0) && (
                <div className="text-center py-10">
                  <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No interview questions available yet.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 px-5 py-3">
              <p className="text-xs text-slate-400 text-center">
                Questions from previous placement drives — use them to prepare!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Placements;
