import { useEffect, useState } from "react";
import axios from "axios";

const AdminPlacements = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    branch: "",
    year: "",
    ctc: "",
    requiredSkills: "",
    eligibleBranches: "",
    description: "",
    studentsSelected: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/placements");
      
      // Ensure we always have an array
      if (Array.isArray(res.data)) {
        setPlacements(res.data);
      } else {
        console.warn("API returned non-array data:", res.data);
        setPlacements([]);
      }
    } catch (err) {
      console.error("Failed to fetch placements:", err);
      setError("Failed to fetch placements. Using dummy data.");
      
      // Fallback to dummy data if API fails
      setPlacements([
        {
          _id: "1",
          company: "Google",
          branch: "CSE",
          year: 2025,
          ctc: "12 LPA",
          eligibleBranches: ["CSE", "IT"],
          description: "Software Engineering roles"
        },
        {
          _id: "2", 
          company: "Amazon",
          branch: "ECE",
          year: 2024,
          ctc: "14 LPA",
          eligibleBranches: ["CSE", "ECE"],
          description: "SDE positions"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(",").map(s => s.trim()),
        eligibleBranches: formData.eligibleBranches.split(",").map(b => b.trim()),
        studentsSelected: formData.studentsSelected ? JSON.parse(formData.studentsSelected) : []
      };

      await axios.post("/api/placements", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      // Reset form
      setFormData({
        company: "",
        branch: "",
        year: "",
        ctc: "",
        requiredSkills: "",
        eligibleBranches: "",
        description: "",
        studentsSelected: ""
      });
      
      fetchData(); // refresh
      alert("Placement added successfully!");
    } catch (err) {
      console.error("Failed to add placement:", err);
      alert("Failed to add placement: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading placements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Add Placement</h2>
      
      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 my-4">
        {["company", "branch", "year", "ctc", "requiredSkills", "eligibleBranches", "description"].map((f) => (
          <input
            key={f}
            name={f}
            value={formData[f]}
            onChange={handleChange}
            placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
            className="border p-2 rounded"
            required
          />
        ))}
        <textarea
          name="studentsSelected"
          placeholder='JSON: [{"name": "Alice", "branch": "CSE", "year": 2024, "skills": ["JS"], "package": "12 LPA"}]'
          className="col-span-2 border p-2 rounded"
          rows={4}
          value={formData.studentsSelected}
          onChange={handleChange}
        ></textarea>
        <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Add Record
        </button>
      </form>

      <h3 className="text-lg font-bold mt-6">Existing Records ({placements.length})</h3>
      
      {placements.length === 0 ? (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-gray-600">No placement records found.</p>
        </div>
      ) : (
        <ul className="mt-2 space-y-2">
          {placements.map((p) => (
            <li key={p._id} className="border p-2 rounded bg-white shadow-sm">
              <div className="font-semibold">{p.company}</div>
              <div className="text-sm text-gray-600">
                {p.branch} - {p.year} - {p.ctc}
              </div>
              {p.description && (
                <div className="text-sm text-gray-500 mt-1">{p.description}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPlacements;