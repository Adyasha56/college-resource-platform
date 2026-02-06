import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from "groq-sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recommendationsPath = path.join(__dirname, "../data/recommendations.json");

// Initialize LLM clients
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Load rule-based recommendations as fallback
let ruleBasedRecommendations = {};
try {
  ruleBasedRecommendations = JSON.parse(
    fs.readFileSync(recommendationsPath, "utf-8")
  );
} catch (err) {
  console.error("Failed to load recommendations.json:", err);
}

// Check if recommendations should be regenerated
export const shouldRegenerate = (user) => {
  if (!user.recommendations?.data) {
    console.log("No cached recommendations");
    return true;
  }

  // Check if expired (30 days)
  const expiresAt = new Date(user.recommendations.expiresAt);
  if (new Date() > expiresAt) {
    console.log("Recommendations expired");
    return true;
  }

  // Check for significant profile changes
  const snapshot = user.recommendations.profileSnapshot;
  if (!snapshot) return true;

  const changes = [
    user.careerGoal !== snapshot.careerGoal,
    user.year !== snapshot.year,
    (user.skills?.length || 0) - (snapshot.skills?.length || 0) >= 3,
  ];

  if (changes.some((c) => c)) {
    console.log("Significant profile changes detected");
    return true;
  }

  console.log("Using cached recommendations");
  return false;
};

// Check refresh rate limit (7 days)
export const canRefreshNow = (user) => {
  if (!user.recommendations?.lastManualRefresh) return true;

  const lastRefresh = new Date(user.recommendations.lastManualRefresh);
  const daysSinceRefresh = (new Date() - lastRefresh) / (1000 * 60 * 60 * 24);

  return daysSinceRefresh >= 7;
};

// Create prompt for LLM
const createPrompt = (user) => {
  const skillsList = user.skills?.map((s) => s.name).join(", ") || "None";
  const interestsList =
    [...(user.interestedFields || []), ...(user.customInterests || [])]
      .join(", ") || "General";

  return `You are an expert career advisor for engineering students. Based on the following profile, generate highly personalized learning recommendations in JSON format.

User Profile:
- Name: ${user.name}
- Branch: ${user.branch}
- Year: ${user.year}
- Career Goal: ${user.careerGoal || "Not specified"}
- Current Skills: ${skillsList}
- Interests: ${interestsList}

Generate recommendations in this exact JSON structure:
{
  "learningPath": {
    "phase1": { 
      "title": "Foundation Phase",
      "duration": "1-2 months", 
      "topics": ["topic1", "topic2", "topic3"],
      "description": "brief description"
    },
    "phase2": { 
      "title": "Core Skills",
      "duration": "2-3 months", 
      "topics": ["topic1", "topic2", "topic3"],
      "description": "brief description"
    },
    "phase3": { 
      "title": "Advanced Phase",
      "duration": "2-3 months", 
      "topics": ["topic1", "topic2"],
      "description": "brief description"
    }
  },
  "trendingSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "projectIdeas": [
    { 
      "title": "Project Name",
      "difficulty": "Beginner|Intermediate|Advanced", 
      "skills": ["skill1", "skill2"],
      "description": "brief description",
      "estimatedDuration": "2-3 weeks"
    },
    { 
      "title": "Project Name 2",
      "difficulty": "Intermediate", 
      "skills": ["skill1", "skill2"],
      "description": "brief description",
      "estimatedDuration": "3-4 weeks"
    }
  ],
  "resources": [
    { "name": "Resource Name", "type": "course|book|tutorial|documentation", "url": "https://...", "free": true },
    { "name": "Resource Name 2", "type": "course", "url": "https://...", "free": false }
  ],
  "exploreAreas": ["area1", "area2", "area3"],
  "careerInsights": "A 2-3 line paragraph about job market trends, expected roles, and companies actively hiring for this career goal."
}

Ensure:
1. Recommendations are specific to their career goal and aim
2. Skills align with their branch and year
3. All URLs are real and valid
4. Return ONLY valid JSON, no markdown or extra text`;
};

// Generate recommendations via Gemini
export const generateViaGemini = async (user) => {
  try {
    console.log("Attempting to generate recommendations via Gemini...");
    const model = gemini.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = createPrompt(user);
    const response = await model.generateContent(prompt);
    const text = response.response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const recommendations = JSON.parse(jsonMatch[0]);
    console.log("✓ Gemini generation successful");

    return {
      data: recommendations,
      provider: "gemini",
    };
  } catch (err) {
    console.error("Gemini generation failed:", err.message);
    return null;
  }
};

// Generate recommendations via Groq (fallback)
export const generateViaGroq = async (user) => {
  try {
    console.log("Attempting to generate recommendations via Groq...");
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: createPrompt(user),
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("No content in Groq response");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const recommendations = JSON.parse(jsonMatch[0]);
    console.log("✓ Groq generation successful");

    return {
      data: recommendations,
      provider: "groq",
    };
  } catch (err) {
    console.error("Groq generation failed:", err.message);
    return null;
  }
};

// Generate recommendations via rule-based system
export const generateRuleBased = (user) => {
  try {
    console.log("Using rule-based recommendations...");
    const branchKey = user.branch.toLowerCase();
    const yearKey = String(user.year);

    let data = ruleBasedRecommendations[branchKey]?.[yearKey];

    if (!data) {
      // Fallback to year 1 if specific year not found
      data = ruleBasedRecommendations[branchKey]?.["1"];
    }

    if (!data) {
      // Generic fallback
      data = {
        skills: [
          "Programming Basics",
          "Problem Solving",
          "Version Control",
        ],
        projects: ["Portfolio Website", "Simple Project"],
        resources: [
          {
            name: "FreeCodeCamp",
            url: "https://freecodecamp.org",
          },
        ],
      };
    }

    console.log("✓ Rule-based generation successful");

    return {
      data,
      provider: "rule-based",
    };
  } catch (err) {
    console.error("Rule-based generation failed:", err.message);
    return null;
  }
};

// Main recommendation generation with fallback chain
export const generateRecommendations = async (user, forceRefresh = false) => {
  try {
    // Check if refresh is allowed
    if (forceRefresh && !canRefreshNow(user)) {
      const daysSinceRefresh =
        (new Date() - new Date(user.recommendations.lastManualRefresh)) /
        (1000 * 60 * 60 * 24);
      const daysRemaining = Math.ceil(7 - daysSinceRefresh);

      throw new Error(
        `Refresh available in ${daysRemaining} day${daysRemaining > 1 ? "s" : ""}`
      );
    }

    // Check if we should regenerate
    if (!forceRefresh && !shouldRegenerate(user)) {
      return user.recommendations;
    }

    let result = null;

    // Priority: Gemini → Groq → Rule-based
    if (process.env.GEMINI_API_KEY) {
      result = await generateViaGemini(user);
    }

    if (!result && process.env.GROQ_API_KEY) {
      result = await generateViaGroq(user);
    }

    if (!result) {
      result = generateRuleBased(user);
    }

    if (!result) {
      throw new Error("All recommendation generation methods failed");
    }

    // Create profile snapshot for change detection
    const profileSnapshot = {
      careerGoal: user.careerGoal,
      skills: user.skills?.map((s) => s.name) || [],
      year: user.year,
    };

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    return {
      data: result.data,
      generatedAt: now,
      expiresAt,
      provider: result.provider,
      profileSnapshot,
      lastManualRefresh: forceRefresh ? now : user.recommendations?.lastManualRefresh,
    };
  } catch (err) {
    console.error("Recommendation generation error:", err.message);
    throw err;
  }
};
