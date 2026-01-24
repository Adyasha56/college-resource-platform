import React, { useState, useEffect } from "react";

const InterestSelector = ({ selectedInterests, setSelectedInterests, customInterests, setCustomInterests }) => {
  const [availableFields, setAvailableFields] = useState([]);
  const [customInput, setCustomInput] = useState("");

  // Fetch interest fields from API
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/interests`);
        const data = await res.json();
        setAvailableFields(data.fields || []);
      } catch (err) {
        console.error("Error fetching interests:", err);
        // Fallback fields
        setAvailableFields([
          'Web Development', 'AI/ML', 'Data Science', 'Mobile Development',
          'DevOps', 'Cybersecurity', 'Cloud Computing', 'Blockchain',
          'Game Development', 'Embedded Systems', 'Competitive Programming', 'UI/UX Design'
        ]);
      }
    };
    fetchFields();
  }, []);

  const toggleInterest = (field) => {
    if (selectedInterests.includes(field)) {
      setSelectedInterests(selectedInterests.filter((f) => f !== field));
    } else {
      if (selectedInterests.length >= 5) {
        alert("Maximum 5 interests allowed");
        return;
      }
      setSelectedInterests([...selectedInterests, field]);
    }
  };

  const addCustomInterest = () => {
    if (!customInput.trim()) return;
    if (customInterests.length >= 3) {
      alert("Maximum 3 custom interests allowed");
      return;
    }
    if (customInterests.includes(customInput.trim())) return;
    
    setCustomInterests([...customInterests, customInput.trim()]);
    setCustomInput("");
  };

  const removeCustomInterest = (interest) => {
    setCustomInterests(customInterests.filter((i) => i !== interest));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomInterest();
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
        Interested Fields ({selectedInterests.length}/5)
      </label>
      <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "12px" }}>
        Select the areas you want to explore or build your career in
      </p>

      {/* Predefined fields */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "15px",
        }}
      >
        {availableFields.map((field, idx) => {
          const isSelected = selectedInterests.includes(field);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggleInterest(field)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 16px",
                borderRadius: "25px",
                border: isSelected ? "2px solid #213448" : "2px solid #94B4C1",
                backgroundColor: isSelected ? "#213448" : "#fff",
                color: isSelected ? "#fff" : "#213448",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <span>{getFieldIcon(field)}</span>
              <span>{field}</span>
            </button>
          );
        })}
      </div>

      {/* Custom interests section */}
      <div style={{ marginTop: "15px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "500",
            color: "#213448",
            fontSize: "14px",
          }}
        >
          Add Custom Interest (Optional)
        </label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., IoT, Quantum Computing"
            style={{
              flex: 1,
              padding: "10px 15px",
              borderRadius: "8px",
              border: "2px solid #94B4C1",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={addCustomInterest}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#547792",
              color: "#fff",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>

        {/* Custom interest tags */}
        {customInterests.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            {customInterests.map((interest, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#547792",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "15px",
                  fontSize: "13px",
                }}
              >
                <span>{interest}</span>
                <button
                  onClick={() => removeCustomInterest(interest)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#f87171",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestSelector;
