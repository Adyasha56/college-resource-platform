// src/pages/Placements.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const dummyPlacements = [
  {
    company: "Google",
    branch: "CSE",
    year: 2025,
    ctc: "12 LPA",
    eligibleBranches: ["CSE", "IT"],
    description: "Off-campus opportunity for software engineering roles.",
    studentsSelected: [
      {
        name: "Rahul Mehta",
        branch: "CSE",
        year: 2025,
        package: "12 LPA",
        skills: ["DSA", "React", "Node"]
      }
    ]
  },
  {
    company: "Amazon",
    branch: "ECE",
    year: 2024,
    ctc: "14 LPA",
    eligibleBranches: ["CSE", "ECE", "EE"],
    description: "Hiring for SDE Interns and Full-time Engineers.",
    studentsSelected: [
      {
        name: "Priya Das",
        branch: "ECE",
        year: 2024,
        package: "14 LPA",
        skills: ["Java", "System Design"]
      }
    ]
  }
];

const Placements = () => {
  const [placements, setPlacements] = useState([]);

 useEffect(() => {
  const fetchPlacements = async () => {
    try {
      const res = await fetch('/api/placements'); // or full URL if needed
      const data = await res.json();
      setPlacements(data);
    } catch (err) {
      console.error('Failed to fetch placements', err);
    }
  };
  fetchPlacements();
}, []);


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
        Placement Records
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {placements.map((item, index) => (
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border"
          >
            <div className="bg-gray-300 h-40 rounded-t-lg flex items-center justify-center text-white font-semibold text-xl">
              {item.company}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-blue-800">
                {item.company}
              </h2>
              <p className="text-gray-700 text-sm">{item.description}</p>

              <ul className="mt-4 text-sm text-gray-600 space-y-1">
                <li>
                  <strong>Branch:</strong> {item.branch}
                </li>
                <li>
                  <strong>Year:</strong> {item.year}
                </li>
                <li>
                  <strong>CTC:</strong> {item.ctc}
                </li>
                <li>
                  <strong>Eligible Branches:</strong>{" "}
                  {item.eligibleBranches.join(", ")}
                </li>
              </ul>

              <div className="mt-4">
                <p className="font-medium text-gray-800">
                  Students Selected:
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {item.studentsSelected.map((stu, i) => (
                    <li key={i}>
                      {stu.name} ({stu.branch}, {stu.year}) - {stu.package}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex justify-between text-sm text-blue-600 font-medium">
                <a href="#">View More</a>
                <a href="#">Apply</a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Placements;
