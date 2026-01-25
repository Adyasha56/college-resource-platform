import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EditProfileModal from "../components/EditProfileModal";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { login } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  // Fetch full profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          // Update localStorage with latest user data
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    login(updatedUser, localStorage.getItem("token"));
  };

  const fetchRecommendations = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecommendations(data?.data || null);
      setShowRecommendations(true);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    }
  };

  const getLevelStars = (level) => {
    switch (level) {
      case "Beginner": return "⭐";
      case "Intermediate": return "⭐⭐";
      case "Advanced": return "⭐⭐⭐";
      default: return "⭐";
    }
  };

  const getFieldIcon = (field) => {
    const icons = {
      'Web Development': '🌐',
      'AI/ML': '🤖',
      'Data Science': '📊',
      'Mobile Development': '📱',
      'DevOps': '⚙️',
      'Cybersecurity': '🔒',
      'Cloud Computing': '☁️',
      'Blockchain': '⛓️',
      'Game Development': '🎮',
      'Embedded Systems': '🔌',
      'Competitive Programming': '💻',
      'UI/UX Design': '🎨'
    };
    return icons[field] || '📌';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "350px 1fr",
        gap: "25px",
      }}
      className="profile-grid"
      >
        {/* Left Column - Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Card */}
          <div style={{
            backgroundColor: "#213448",
            borderRadius: "20px",
            padding: "30px",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            marginBottom: "20px",
          }}>
            {/* Avatar */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                backgroundColor: "#547792",
                margin: "0 auto 15px",
                overflow: "hidden",
                border: "4px solid #94B4C1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "50px" }}>👤</span>
                )}
              </div>
              <h2 style={{ margin: "0 0 5px", fontSize: "24px", color: "#ECEFCA" }}>{user?.name}</h2>
              <p style={{ margin: 0, color: "#94B4C1", fontSize: "14px" }}>
                {user?.branch} • {user?.year}{user?.year === 1 ? "st" : user?.year === 2 ? "nd" : user?.year === 3 ? "rd" : "th"} Year
              </p>
            </div>

            {/* Bio */}
            {user?.bio && (
              <div style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "20px",
              }}>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#ECEFCA" }}>
                  {user.bio}
                </p>
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span>Email - </span>
                <span style={{ color: "#94B4C1", fontSize: "14px" }}>{user?.email}</span>
              </div>
              {user?.careerGoal && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span>Goal - </span>
                  <span style={{ color: "#94B4C1", fontSize: "14px" }}>{user.careerGoal}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(user?.socialLinks?.github || user?.socialLinks?.linkedin || user?.socialLinks?.portfolio) && (
              <div style={{ 
                display: "flex", 
                gap: "12px", 
                marginBottom: "20px",
                flexWrap: "wrap"
              }}>
                {user?.socialLinks?.github && (
                  <a
                    href={user.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: "20px",
                      color: "#ECEFCA",
                      textDecoration: "none",
                      fontSize: "13px",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                  >
                    <span></span> GitHub
                  </a>
                )}
                {user?.socialLinks?.linkedin && (
                  <a
                    href={user.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: "20px",
                      color: "#ECEFCA",
                      textDecoration: "none",
                      fontSize: "13px",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                  >
                    <span></span> LinkedIn
                  </a>
                )}
                {user?.socialLinks?.portfolio && (
                  <a
                    href={user.socialLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderRadius: "20px",
                      color: "#ECEFCA",
                      textDecoration: "none",
                      fontSize: "13px",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
                  >
                    <span></span> Portfolio
                  </a>
                )}
              </div>
            )}

            {/* Edit Button */}
            <button
              onClick={() => setShowEditModal(true)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "2px solid #94B4C1",
                backgroundColor: "transparent",
                color: "#ECEFCA",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#94B4C1";
                e.target.style.color = "#213448";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#ECEFCA";
              }}
            >
              Edit Profile
            </button>
          </div>

          {/* Skills Card */}
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            padding: "25px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
          }}>
            <h3 style={{ margin: "0 0 15px", color: "#213448", display: "flex", alignItems: "center", gap: "8px" }}>
              Skills
            </h3>
            {user?.skills && user.skills.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {user.skills.map((skill, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#213448",
                    color: "#fff",
                    padding: "8px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                  }}>
                    <span>{skill.name}</span>
                    <span style={{ fontSize: "10px" }}>{getLevelStars(skill.level)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
                No skills added yet. Click edit to add your skills!
              </p>
            )}
          </div>
        </motion.div>

        {/* Right Column - Details & Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Interested Fields Card */}
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            padding: "25px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
            marginBottom: "20px",
          }}>
            <h3 style={{ margin: "0 0 15px", color: "#213448", display: "flex", alignItems: "center", gap: "8px" }}>
              Interested Fields
            </h3>
            {(user?.interestedFields?.length > 0 || user?.customInterests?.length > 0) ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {user.interestedFields?.map((field, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#547792",
                    color: "#fff",
                    padding: "10px 18px",
                    borderRadius: "25px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}>
                    <span>{getFieldIcon(field)}</span>
                    <span>{field}</span>
                  </div>
                ))}
                {user.customInterests?.map((interest, idx) => (
                  <div key={`custom-${idx}`} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "#94B4C1",
                    color: "#213448",
                    padding: "10px 18px",
                    borderRadius: "25px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}>
                    <span>📌</span>
                    <span>{interest}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
                No interests selected yet. Tell us what you want to learn!
              </p>
            )}
          </div>

          {/* Profile Completion Card */}
          {!user?.profileCompleted && (
            <div style={{
              backgroundColor: "#FEF3C7",
              border: "2px solid #F59E0B",
              borderRadius: "15px",
              padding: "20px",
              marginBottom: "20px",
            }}>
              <h4 style={{ margin: "0 0 10px", color: "#92400E", display: "flex", alignItems: "center", gap: "8px" }}>
                ⚠️ Complete Your Profile
              </h4>
              <p style={{ margin: "0 0 15px", color: "#92400E", fontSize: "14px" }}>
                Add your bio, skills, and interests to get personalized recommendations!
              </p>
              <button
                onClick={() => setShowEditModal(true)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#F59E0B",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Complete Now
              </button>
            </div>
          )}

          {/* Get Recommendations Button */}
          {!showRecommendations && (
            <div style={{
              backgroundColor: "#547792",
              borderRadius: "20px",
              padding: "30px",
              textAlign: "center",
              boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
              marginBottom: "20px",
            }}>
              <h3 style={{ margin: "0 0 10px", color: "#ECEFCA" }}>Ready to Level Up?</h3>
              <p style={{ margin: "0 0 20px", color: "#94B4C1", fontSize: "14px" }}>
                Get personalized recommendations based on your profile
              </p>
              <button
                onClick={fetchRecommendations}
                style={{
                  padding: "15px 40px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#213448",
                  color: "#ECEFCA",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                Get Recommendations
              </button>
            </div>
          )}

          {/* Recommendations Section */}
          <AnimatePresence>
            {showRecommendations && recommendations && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  padding: "25px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ margin: 0, color: "#213448" }}>Your Recommendations</h3>
                  <button
                    onClick={() => setShowRecommendations(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "20px",
                      cursor: "pointer",
                      color: "#6b7280",
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Skills to Learn */}
                {recommendations.skills?.length > 0 && (
                  <div style={{ marginBottom: "25px" }}>
                    <h4 style={{ margin: "0 0 12px", color: "#547792" }}>Skills to Learn</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {recommendations.skills.map((skill, i) => (
                        <span key={i} style={{
                          backgroundColor: "#E0F2FE",
                          color: "#0369A1",
                          padding: "8px 15px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {recommendations.projects?.length > 0 && (
                  <div style={{ marginBottom: "25px" }}>
                    <h4 style={{ margin: "0 0 12px", color: "#547792" }}>Project Ideas</h4>
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {recommendations.projects.map((project, i) => (
                        <li key={i} style={{ marginBottom: "8px", color: "#374151", lineHeight: "1.5" }}>
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Resources */}
                {recommendations.resources?.length > 0 && (
                  <div>
                    <h4 style={{ margin: "0 0 12px", color: "#547792" }}>Resources</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {recommendations.resources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "12px 15px",
                            backgroundColor: "#f9fafb",
                            borderRadius: "10px",
                            textDecoration: "none",
                            color: "#213448",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e5e7eb"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                        >
                          <span></span>
                          <span style={{ fontWeight: "500" }}>{res.name}</span>
                          <span style={{ marginLeft: "auto", color: "#6b7280" }}>↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 900px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSave={handleProfileUpdate}
      />
    </div>
  );
};

export default Profile;
