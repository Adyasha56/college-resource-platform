import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SkillInput from "./SkillInput";
import InterestSelector from "./InterestSelector";

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    year: user?.year || 1,
    branch: user?.branch || "",
    careerGoal: user?.careerGoal || "",
    aim: user?.aim || "",
    socialLinks: {
      github: user?.socialLinks?.github || "",
      linkedin: user?.socialLinks?.linkedin || "",
      portfolio: user?.socialLinks?.portfolio || "",
    },
  });
  const [skills, setSkills] = useState(user?.skills || []);
  const [interestedFields, setInterestedFields] = useState(user?.interestedFields || []);
  const [customInterests, setCustomInterests] = useState(user?.customInterests || []);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const fileInputRef = useRef(null);

  const branches = [
    "Computer Science (CSE)",
    "Information Technology (IT)",
    "Electronics & Communication (ECE)",
    "Electrical Engineering (EE)",
    "Mechanical Engineering (ME)",
    "Civil Engineering (CE)",
    "Chemical Engineering",
    "Biotechnology",
    "Other"
  ];

  const careerGoals = [
    { value: "", label: "Select your goal" },
    { value: "Placement", label: "Campus Placement" },
    { value: "Higher Studies", label: "Higher Studies (MS/MTech)" },
    { value: "Startup", label: "Startup / Entrepreneurship" },
    { value: "Freelancing", label: "Freelancing" },
    { value: "Research", label: "Research" }
  ];

  const aims = [
    { value: "", label: "Select your aim" },
    { value: "Placement", label: "Campus Placement" },
    { value: "Higher Studies", label: "Higher Studies" },
    { value: "Startup", label: "Startup" },
    { value: "Freelancing", label: "Freelancing" },
    { value: "Research", label: "Research" }
  ];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Upload avatar if changed
      let avatarUrl = user?.avatar;
      if (avatarFile) {
        const formDataAvatar = new FormData();
        formDataAvatar.append("avatar", avatarFile);

        const avatarRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/profile/avatar`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formDataAvatar,
          }
        );
        const avatarData = await avatarRes.json();
        if (avatarRes.ok) {
          avatarUrl = avatarData.avatar;
        }
      }

      // Update profile
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            skills,
            interestedFields,
            customInterests,
            socialLinks: formData.socialLinks,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Update user with avatar
        const updatedUser = { ...data.user, avatar: avatarUrl };
        onSave(updatedUser);
        onClose();
      } else {
        alert(data.message || "Error updating profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "skills", label: "Skills" },
    { id: "interests", label: "Interests" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          padding: "20px",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#213448",
              color: "#fff",
              padding: "20px 25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
              borderRadius: "16px 16px 0 0",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "20px" }}>Edit Profile</h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "2px solid #eee",
              backgroundColor: "#f9fafb",
              flexShrink: 0,
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "15px",
                  border: "none",
                  backgroundColor: activeTab === tab.id ? "#fff" : "transparent",
                  borderBottom: activeTab === tab.id ? "3px solid #213448" : "none",
                  cursor: "pointer",
                  fontWeight: activeTab === tab.id ? "600" : "400",
                  color: activeTab === tab.id ? "#213448" : "#6b7280",
                  transition: "all 0.2s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            <div
              style={{
                padding: "25px",
                overflowY: "auto",
                flex: 1,
              }}
            >
              {/* Basic Info Tab */}
              {activeTab === "basic" && (
                <div>
                  {/* Avatar */}
                  <div style={{ textAlign: "center", marginBottom: "25px" }}>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        backgroundColor: "#94B4C1",
                        margin: "0 auto 10px",
                        cursor: "pointer",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "3px solid #213448",
                      }}
                    >
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ fontSize: "40px" }}>👤</span>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#547792",
                        cursor: "pointer",
                        fontSize: "14px",
                        textDecoration: "underline",
                      }}
                    >
                      Change Photo
                    </button>
                  </div>

                  {/* Name */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#213448" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        borderRadius: "8px",
                        border: "2px solid #94B4C1",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* Bio */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#213448" }}>
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        borderRadius: "8px",
                        border: "2px solid #94B4C1",
                        fontSize: "14px",
                        outline: "none",
                        resize: "vertical",
                      }}
                    />
                    <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px" }}>
                      {formData.bio.length}/500 characters
                    </p>
                  </div>

                  {/* Year & Branch */}
                  <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#213448" }}>
                        Year
                      </label>
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        style={{
                          width: "100%",
                          padding: "12px 15px",
                          borderRadius: "8px",
                          border: "2px solid #94B4C1",
                          fontSize: "14px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <option value={1}>1st Year</option>
                        <option value={2}>2nd Year</option>
                        <option value={3}>3rd Year</option>
                        <option value={4}>4th Year</option>
                      </select>
                    </div>
                    <div style={{ flex: 2 }}>
                      <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#213448" }}>
                        Branch
                      </label>
                      <select
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "12px 15px",
                          borderRadius: "8px",
                          border: "2px solid #94B4C1",
                          fontSize: "14px",
                          backgroundColor: "#fff",
                        }}
                      >
                        {branches.map((branch, idx) => (
                          <option key={idx} value={branch}>{branch}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Career Goal */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#213448" }}>
                      Career Goal
                    </label>
                    <select
                      value={formData.careerGoal}
                      onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        borderRadius: "8px",
                        border: "2px solid #94B4C1",
                        fontSize: "14px",
                        backgroundColor: "#fff",
                      }}
                    >
                      {careerGoals.map((goal, idx) => (
                        <option key={idx} value={goal.value}>{goal.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Aim */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#213448" }}>
                      Your Aim 🎯
                    </label>
                    <select
                      value={formData.aim}
                      onChange={(e) => setFormData({ ...formData, aim: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        borderRadius: "8px",
                        border: "2px solid #94B4C1",
                        fontSize: "14px",
                        backgroundColor: "#fff",
                      }}
                    >
                      {aims.map((aim, idx) => (
                        <option key={idx} value={aim.value}>{aim.label}</option>
                      ))}
                    </select>
                    <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px" }}>
                      What do you want to achieve after college?
                    </p>
                  </div>

                  {/* Social Links Section */}
                  <div style={{ 
                    marginBottom: "20px", 
                    padding: "20px", 
                    backgroundColor: "#f8fafc", 
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0"
                  }}>
                    <h4 style={{ margin: "0 0 15px", color: "#213448", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                      Social Links
                    </h4>
                    
                    {/* GitHub */}
                    <div style={{ marginBottom: "15px" }}>
                      <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#374151", fontSize: "14px" }}>
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={formData.socialLinks.github}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          socialLinks: { ...formData.socialLinks, github: e.target.value } 
                        })}
                        placeholder="https://github.com/username"
                        style={{
                          width: "100%",
                          padding: "10px 15px",
                          borderRadius: "8px",
                          border: "2px solid #94B4C1",
                          fontSize: "14px",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {/* LinkedIn */}
                    <div style={{ marginBottom: "15px" }}>
                      <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#374151", fontSize: "14px" }}>
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={formData.socialLinks.linkedin}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          socialLinks: { ...formData.socialLinks, linkedin: e.target.value } 
                        })}
                        placeholder="https://linkedin.com/in/username"
                        style={{
                          width: "100%",
                          padding: "10px 15px",
                          borderRadius: "8px",
                          border: "2px solid #94B4C1",
                          fontSize: "14px",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {/* Portfolio */}
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#374151", fontSize: "14px" }}>
                        Portfolio Website
                      </label>
                      <input
                        type="url"
                        value={formData.socialLinks.portfolio}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          socialLinks: { ...formData.socialLinks, portfolio: e.target.value } 
                        })}
                        placeholder="https://yourportfolio.com"
                        style={{
                          width: "100%",
                          padding: "10px 15px",
                          borderRadius: "8px",
                          border: "2px solid #94B4C1",
                          fontSize: "14px",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === "skills" && (
                <SkillInput skills={skills} setSkills={setSkills} />
              )}

              {/* Interests Tab */}
              {activeTab === "interests" && (
                <InterestSelector
                  selectedInterests={interestedFields}
                  setSelectedInterests={setInterestedFields}
                  customInterests={customInterests}
                  setCustomInterests={setCustomInterests}
                />
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "20px 25px",
                borderTop: "2px solid #e5e7eb",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                backgroundColor: "#f9fafb",
                flexShrink: 0,
                borderRadius: "0 0 16px 16px",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "14px 28px",
                  borderRadius: "10px",
                  border: "2px solid #213448",
                  backgroundColor: "#fff",
                  color: "#213448",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#fff";
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "14px 32px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: loading ? "#6b7280" : "#213448",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(33, 52, 72, 0.3)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.backgroundColor = "#1a2a3a";
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.backgroundColor = "#213448";
                }}
              >
                {loading ? "Saving..." : "💾 Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
