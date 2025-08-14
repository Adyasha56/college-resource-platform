import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to recommendations.json
const recommendationsPath = path.join(__dirname, "../data/recommendations.json");

// Load JSON data once
let recommendations = {};
try {
  recommendations = JSON.parse(fs.readFileSync(recommendationsPath, "utf-8"));
} catch (err) {
  console.error("❌ Failed to load recommendations.json:", err);
}

// Controller
export const getRecommendations = (req, res) => {
  try {
    const { year, branch } = req.user || {};

    if (!year || !branch) {
      return res.status(400).json({
        error: "User year and branch are required for recommendations"
      });
    }

    // Normalize keys (lowercase branch, string year)
    const branchKey = branch.toLowerCase();
    const yearKey = String(year);

    // Check if branch exists
    if (!recommendations[branchKey]) {
      return res.status(404).json({
        error: `No recommendations found for branch: ${branch}`
      });
    }

    // Check if year data exists for that branch
    const yearData = recommendations[branchKey][yearKey];

    if (yearData) {
      return res.status(200).json({ data: yearData });
    } else {
      return res.status(200).json({
        message: `No specific data for Year ${year} in ${branch}, showing Year 1 basics as fallback.`,
        data: recommendations[branchKey]["1"] || {}
      });
    }

  } catch (err) {
    console.error("❌ Recommendation Error:", err);
    res.status(500).json({ error: "Failed to load recommendations" });
  }
};
