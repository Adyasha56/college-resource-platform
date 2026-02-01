import React, { useState } from "react";
import { motion } from "framer-motion";

const RecommendationCard = ({ recommendations, loading, provider, cached }) => {
  const [activePhase, setActivePhase] = useState(1);
  const [activeTab, setActiveTab] = useState("learning");

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <p className="text-center mt-4 text-gray-600">
            Generating your personalized recommendations...
          </p>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">Unable to load recommendations. Please try again.</p>
        </div>
      </div>
    );
  }

  const learningPath = recommendations.learningPath || {};
  const trendingSkills = recommendations.trendingSkills || [];
  const projectIdeas = recommendations.projectIdeas || [];
  const resources = recommendations.resources || [];
  const exploreAreas = recommendations.exploreAreas || [];
  const careerInsights = recommendations.careerInsights || "";

  const phaseTitle = {
    1: learningPath.phase1?.title || "Phase 1",
    2: learningPath.phase2?.title || "Phase 2",
    3: learningPath.phase3?.title || "Phase 3",
  };

  const phaseData = {
    1: learningPath.phase1,
    2: learningPath.phase2,
    3: learningPath.phase3,
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with metadata */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🎯 Your Personalized Learning Path
          </h2>
          <p className="text-gray-600 text-sm">
            {cached ? "📦 Cached" : "✨ Fresh"} • Powered by {provider}
          </p>
        </div>
        <div className="text-right">
          <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            Profile Complete ✓
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {["learning", "skills", "projects", "resources", "insights"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold whitespace-nowrap ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab === "learning"
              ? "📚 Learning Path"
              : tab === "skills"
              ? "💡 Skills"
              : tab === "projects"
              ? "🚀 Projects"
              : tab === "resources"
              ? "📖 Resources"
              : "💼 Insights"}
          </button>
        ))}
      </div>

      {/* Learning Path Tab */}
      {activeTab === "learning" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Phase Selector */}
          <div className="flex gap-4 justify-center">
            {[1, 2, 3].map((phase) => (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  activePhase === phase
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Phase {phase}
              </button>
            ))}
          </div>

          {/* Phase Content */}
          {phaseData[activePhase] && (
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-600"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {phaseData[activePhase].title}
              </h3>
              <p className="text-gray-600 mb-4">
                ⏱️ Duration: {phaseData[activePhase].duration}
              </p>
              {phaseData[activePhase].description && (
                <p className="text-gray-700 mb-6">
                  {phaseData[activePhase].description}
                </p>
              )}

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Topics to Learn:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {phaseData[activePhase].topics?.map((topic, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-2"
                    >
                      <span className="text-blue-600 font-bold">→</span>
                      <span className="text-gray-700">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Skills Tab */}
      {activeTab === "skills" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Trending Skills to Master
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingSkills.map((skill, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200 cursor-pointer hover:shadow-md transition"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">⭐</span>
                  <p className="font-semibold text-gray-800">{skill}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Project Ideas
          </h3>
          {projectIdeas.map((project, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 5 }}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl font-bold text-gray-800">
                  {project.title}
                </h4>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  project.difficulty === "Beginner"
                    ? "bg-green-100 text-green-800"
                    : project.difficulty === "Intermediate"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {project.difficulty}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.skills?.map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                ⏱️ Estimated Duration: {project.estimatedDuration}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Recommended Resources
          </h3>
          {resources.map((resource, idx) => (
            <motion.a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 5 }}
              className="block bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-bold text-gray-800">
                    {resource.name}
                  </h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {resource.type}
                  </p>
                </div>
                {resource.free && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    Free
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm break-all">{resource.url}</p>
            </motion.a>
          ))}
        </motion.div>
      )}

      {/* Insights Tab */}
      {activeTab === "insights" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-8 border border-indigo-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              💼 Career Insights
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {careerInsights}
            </p>
          </div>

          {exploreAreas && exploreAreas.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Explore More Areas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exploreAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-4 border border-orange-200"
                  >
                    <p className="font-semibold text-gray-800">🔍 {area}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default RecommendationCard;
