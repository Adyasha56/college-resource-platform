import React, { useState, useEffect, useRef } from "react";

const SkillInput = ({ skills, setSkills, maxSkills = 15 }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("Beginner");
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Fetch skill suggestions on mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/skills`);
        const data = await res.json();
        setAllSkills(data.skills || []);
      } catch (err) {
        console.error("Error fetching skills:", err);
      }
    };
    fetchSkills();
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = allSkills.filter(
        (skill) =>
          skill.toLowerCase().includes(inputValue.toLowerCase()) &&
          !skills.some((s) => s.name.toLowerCase() === skill.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, allSkills, skills]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addSkill = (skillName) => {
    if (skills.length >= maxSkills) {
      alert(`Maximum ${maxSkills} skills allowed`);
      return;
    }
    if (skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
      return;
    }
    setSkills([...skills, { name: skillName, level: selectedLevel }]);
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeSkill = (skillName) => {
    setSkills(skills.filter((s) => s.name !== skillName));
  };

  const updateSkillLevel = (skillName, newLevel) => {
    setSkills(
      skills.map((s) =>
        s.name === skillName ? { ...s, level: newLevel } : s
      )
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addSkill(inputValue.trim());
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "#4ade80";
      case "Intermediate":
        return "#fbbf24";
      case "Advanced":
        return "#f87171";
      default:
        return "#94a3b8";
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#213448",
        }}
      >
        Skills ({skills.length}/{maxSkills})
      </label>

      {/* Input with level selector */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue && setShowSuggestions(true)}
            placeholder="Type a skill (e.g., React, Python)"
            style={{
              width: "100%",
              padding: "12px 15px",
              borderRadius: "8px",
              border: "2px solid #94B4C1",
              fontSize: "14px",
              outline: "none",
              transition: "border-color 0.2s",
            }}
          />

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "#fff",
                border: "1px solid #94B4C1",
                borderRadius: "8px",
                marginTop: "4px",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 100,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {suggestions.map((skill, idx) => (
                <div
                  key={idx}
                  onClick={() => addSkill(skill)}
                  style={{
                    padding: "10px 15px",
                    cursor: "pointer",
                    borderBottom:
                      idx < suggestions.length - 1 ? "1px solid #eee" : "none",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f3f4f6")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Level selector */}
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          style={{
            padding: "12px 15px",
            borderRadius: "8px",
            border: "2px solid #94B4C1",
            fontSize: "14px",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Skill tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {skills.map((skill, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#213448",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "20px",
              fontSize: "13px",
            }}
          >
            <span>{skill.name}</span>
            <select
              value={skill.level}
              onChange={(e) => updateSkillLevel(skill.name, e.target.value)}
              style={{
                backgroundColor: getLevelColor(skill.level),
                border: "none",
                borderRadius: "10px",
                padding: "2px 6px",
                fontSize: "11px",
                fontWeight: "600",
                color: "#000",
                cursor: "pointer",
              }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <button
              onClick={() => removeSkill(skill.name)}
              style={{
                background: "none",
                border: "none",
                color: "#f87171",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                padding: 0,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "8px" }}>
          Add skills to help us personalize your recommendations
        </p>
      )}
    </div>
  );
};

export default SkillInput;
