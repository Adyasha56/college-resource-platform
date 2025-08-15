import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const fetchRecommendations = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecommendations(data?.data || null);
      setShowSuggestions(true);
    } catch (err) {
      console.error("❌ Error fetching:", err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ECEFCA",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: showSuggestions ? "row" : "column",
          width: "100%",
          maxWidth: "1100px",
          gap: "20px",
        }}
      >
        {/* Profile Card */}
        <motion.div
          animate={{
            flex: showSuggestions ? "0.45" : "1",
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            backgroundColor: "#547792",
            color: "#fff",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          }}
        >
          <h2 style={{ color: "#ECEFCA" }}>👤 Your Profile</h2>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Branch:</strong> {user?.branch}</p>
          <p><strong>Year:</strong> {user?.year}</p>

          {!showSuggestions && (
            <button
              onClick={fetchRecommendations}
              style={{
                backgroundColor: "#213448",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                marginTop: "20px",
                cursor: "pointer",
              }}
            >
              Get Suggestions
            </button>
          )}
        </motion.div>

        {/* Suggestions Card */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{
                backgroundColor: "#94B4C1",
                color: "#213448",
                borderRadius: "15px",
                padding: "20px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                flex: 1,
              }}
            >
              <h2>💡 Suggestions</h2>
              {recommendations ? (
                <>
                  <h3>Skills:</h3>
                  <ul>
                    {recommendations.skills?.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>

                  <h3>Projects:</h3>
                  <ul>
                    {recommendations.projects?.map((project, i) => (
                      <li key={i}>{project}</li>
                    ))}
                  </ul>

                  <h3>Resources:</h3>
                  <ul>
                    {recommendations.resources?.map((res, i) => (
                      <li key={i}>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#213448" }}
                        >
                          {res.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>No recommendations found.</p>
              )}

              <button
                onClick={() => setShowSuggestions(false)}
                style={{
                  backgroundColor: "#213448",
                  color: "#fff",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: "8px",
                  marginTop: "20px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Responsive tweaks */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="flex-direction: row"] {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
