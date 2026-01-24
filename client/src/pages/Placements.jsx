// src/pages/Placements.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Placements = () => {
  const [placements, setPlacements] = useState([]);

 useEffect(() => {
  const fetchPlacements = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/placements`); 
      const data = await res.json();
      setPlacements(data);
    } catch (err) {
      console.error('Failed to fetch placements', err);
    }
  };
  fetchPlacements();
}, []);


  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-4 md:px-6 py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 md:mb-8 text-blue-900">
        Placement Records
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
        {placements.map((item, index) => (
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-28 sm:h-36 md:h-40 flex items-center justify-center text-white font-semibold text-lg sm:text-xl px-4 text-center">
              {item.company}
            </div>
            <div className="p-3 sm:p-4">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-blue-800">
                {item.company}
              </h2>
              <p className="text-gray-700 text-xs sm:text-sm line-clamp-2">{item.description}</p>

              <ul className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 space-y-1">
                <li>
                  <strong>Branch:</strong> {item.branch}
                </li>
                <li>
                  <strong>Year:</strong> {item.year}
                </li>
                <li>
                  <strong>CTC:</strong> {item.ctc}
                </li>
                <li className="break-words">
                  <strong>Eligible:</strong>{" "}
                  {item.eligibleBranches.join(", ")}
                </li>
              </ul>

              <div className="mt-3 sm:mt-4">
                <p className="font-medium text-gray-800 text-sm">
                  Students Selected:
                </p>
                <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-gray-700 max-h-24 overflow-y-auto">
                  {item.studentsSelected.map((stu, i) => (
                    <li key={i} className="break-words">
                      {stu.name} ({stu.branch}, {stu.year}) - {stu.package}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 sm:mt-4 flex justify-between text-xs sm:text-sm text-blue-600 font-medium">
                <a href="#" className="hover:underline">View More</a>
                <a href="#" className="hover:underline">Apply</a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Placements;
