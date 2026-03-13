import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  BookOpen,
  GraduationCap,
  X,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 12;

const branches = [
  "Computer Science Engineering",
  "Electronics and Communication Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Information Technology",
  "Other",
];
const examTypes = ["modular", "end semester"];

const QuestionPapers = () => {
  const [questionPapers, setQuestionPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [downloadingPaperId, setDownloadingPaperId] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [filters, setFilters] = useState({ year: "", semester: "", branch: "", examType: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchQuestionPapers();
  }, []);

  const fetchQuestionPapers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/questionpapers`);
      const data = await response.json();
      if (data.success) {
        const sorted = [...(data.data || [])].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setQuestionPapers(sorted);
      }
    } catch (error) {
      console.error("Error fetching question papers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPapers = useMemo(() => {
    return questionPapers.filter((paper) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        paper.subject.toLowerCase().includes(q) ||
        paper.branch.toLowerCase().includes(q);
      const matchesYear = !filters.year || paper.year.toString() === filters.year;
      const matchesSem = !filters.semester || paper.semester.toString() === filters.semester;
      const matchesBranch = !filters.branch || paper.branch === filters.branch;
      const matchesType = !filters.examType || paper.examType === filters.examType;
      return matchesSearch && matchesYear && matchesSem && matchesBranch && matchesType;
    });
  }, [questionPapers, searchTerm, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredPapers.length / ITEMS_PER_PAGE));
  const paginatedPapers = filteredPapers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => {
    setFilters({ year: "", semester: "", branch: "", examType: "" });
    setSearchTerm("");
  };

  const hasActiveFilters =
    searchTerm || filters.year || filters.semester || filters.branch || filters.examType;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleDownload = async (paper) => {
    const userToken =
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      localStorage.getItem("studentToken") ||
      localStorage.getItem("authToken");

    if (!userToken) {
      setAuthError(true);
      return;
    }

    try {
      setDownloadingPaperId(paper._id);
      setDownloadStatus("Preparing download...");

      const endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/downloads/questionpaper/${paper._id}`;
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${userToken}`, Accept: "application/octet-stream,*/*" },
      });

      if (response.status === 401) {
        setAuthError(true);
        return;
      }
      if (!response.ok) throw new Error(`Status ${response.status}`);

      const blob = await response.blob();
      const disposition = response.headers.get("content-disposition") || "";
      const match = disposition.match(/filename="?([^";]+)"?/i);
      const fileName =
        (match && match[1]) ||
        `${paper.subject.replace(/[^a-zA-Z0-9\s]/g, "")}_${paper.examType}_Y${paper.year}_S${paper.semester}.pdf`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setDownloadStatus("Download started!");
      setTimeout(() => setDownloadStatus(""), 2500);
    } catch (error) {
      console.error("Download failed:", error);
      if (paper.fileUrl) window.open(paper.fileUrl, "_blank");
      setDownloadStatus("");
    } finally {
      setDownloadingPaperId(null);
    }
  };

  const getPaginationItems = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
      .reduce((acc, p, idx, arr) => {
        if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
        acc.push(p);
        return acc;
      }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading question papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Question Papers
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Browse and download previous year question papers
        </p>
      </div>

      {downloadStatus && (
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300">
          {downloadingPaperId && <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />}
          <span>{downloadStatus}</span>
          <button onClick={() => setDownloadStatus("")} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search + Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by subject or branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2 border border-slate-300 dark:border-slate-600 rounded-full bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                showFilters
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Years</option>
              {["1","2","3","4"].map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
            <select
              value={filters.semester}
              onChange={(e) => handleFilterChange("semester", e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
            <select
              value={filters.branch}
              onChange={(e) => handleFilterChange("branch", e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Branches</option>
              {branches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              value={filters.examType}
              onChange={(e) => handleFilterChange("examType", e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {examTypes.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {filteredPapers.length} paper{filteredPapers.length !== 1 ? "s" : ""} found
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {filteredPapers.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-600 dark:text-slate-400 mb-1">
            No papers found
          </h3>
          <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedPapers.map((paper) => (
              <div
                key={paper._id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        paper.examType === "modular"
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {paper.examType === "modular" ? "Modular" : "End Sem"}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                    {paper.subject}
                  </h3>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{paper.branch}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Year {paper.year} · Sem {paper.semester}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{formatDate(paper.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPaper(paper)}
                      className="flex-1 text-xs px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleDownload(paper)}
                      disabled={downloadingPaperId === paper._id}
                      className="flex-1 flex items-center justify-center gap-1 text-xs px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
                    >
                      {downloadingPaperId === paper._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      {downloadingPaperId === paper._id ? "..." : "Download"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

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

      {/* Detail Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedPaper.subject}
                  </h2>
                  <span
                    className={`inline-block mt-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                      selectedPaper.examType === "modular"
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {selectedPaper.examType === "modular" ? "Modular Exam" : "End Semester Exam"}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Academic Year</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Year {selectedPaper.year}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Semester</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Semester {selectedPaper.semester}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Branch</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedPaper.branch}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Uploaded On</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatDate(selectedPaper.createdAt)}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDownload(selectedPaper)}
                  disabled={downloadingPaperId === selectedPaper._id}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {downloadingPaperId === selectedPaper._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Download Paper
                </button>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Error */}
      {authError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Login Required</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
              You need to be logged in to download question papers.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setAuthError(false)}
                className="flex-1 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setAuthError(false); window.location.href = "/login"; }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPapers;
