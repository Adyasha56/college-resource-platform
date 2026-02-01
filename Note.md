## Recommendation plan as of now

Student Profile Data → LLM Analysis → Personalized Recommendations → Cache/Store
     ↓
- degree, branch, year
- current skills
- career goal (fullstack/web dev/app dev)
- aim (placements/higher studies)


Step 1: Quick Registration
    ├─ Name
    ├─ Email  
    ├─ Password
    ├─ Branch (CSE, ECE, etc.)
    └─ Year (1, 2, 3, 4)
    ↓
Registration Complete → Login
    ↓
Step 2: First Login → 
    ↓
User goes to -Profile Page:
    ┌──────────────────────────────────────┐
    │ ⚠️ Complete Your Profile             │
    │                                      │
    │ To get personalized recommendations  │
    │ please complete these details:       │
    │                                      │
    │ [Incomplete Profile Form]            │
    │  - What's your goal? (placements/etc)│
    │  - Career aim? (fullstack/data/etc)  │
    │  - Skills you have? (tags input)     │
    │                                      │
    │  [Save & Generate Recommendations]   │
    └──────────────────────────────────────┘
    ↓
User Fills & Clicks "Save"
    ↓
Backend:
    ├─ Updates user profile
    ├─ Sets needsRecommendationUpdate = true
    ├─ Triggers LLM generation
    └─ Shows loading state
    ↓
After 3-5 seconds:
    ├─ Recommendations generated
    ├─ Cached in database
    └─ Display on Profile page
    ↓
User Sees:
    ┌──────────────────────────────────────┐
    │ ✅ Profile Complete                  │
    │                                      │
    │ 🎯 Your Personalized Learning Path   │
    │                                      │
    │ [Recommendations Display]            │
    └──────────────────────────────────────┘

## LLM working 
    User requests recommendations
    ↓
[Check 1] Cache exists? 
    NO → Generate fresh (LLM call) ✓
    YES ↓
    
[Check 2] Cache expired (>30 days)?
    YES → Generate fresh (LLM call) ✓
    NO ↓
    
[Check 3] Profile changed significantly?
    - Goal changed? → YES ✓
    - Career aim changed? → YES ✓
    - Added 3+ new skills? → YES ✓
    - Year changed (e.g., 2nd → 3rd)? → YES ✓
    If YES → Generate fresh (LLM call) ✓
    NO ↓
    
[Check 4] User clicked "Refresh"?
    YES → Check last refresh date
        - <7 days ago → Block (show message)
        - >7 days ago → Generate fresh (LLM call) ✓
    NO ↓
    
→ Serve from cache (NO LLM call) ✓✓✓

## Integration startegy

Priority Order:

1. Gemini 2.0 Flash (Primary)
   ├─ Free tier: 1,500 requests/day
   ├─ Quality: Excellent for structured output
   ├─ Speed: ~2-3 seconds
   └─ Cost: ₹0 (free tier), ₹0.05/request (paid)

2. Groq (Llama 3.3) (Fallback #1)
   ├─ Free tier: Generous limits
   ├─ Quality: Good, slightly less structured
   ├─ Speed: Very fast (~1 second)
   └─ Cost: ₹0 (free tier)

3. Rule-based System (Fallback #2)
   ├─ Pre-curated recommendations by degree/branch/year
   ├─ Static but reliable
   ├─ Speed: Instant
   └─ Cost: ₹0

Fallback Logic:
Gemini fails/quota exceeded → Try Groq → Use rule-based

---

## 📋 Implementation Plan & Suggestions

### Profile Data Structure (Fields Needed)
```
User Model should have:
├─ name, email, password (existing)
├─ branch (existing - CSE, ECE, etc.)
├─ year/semester (existing)
│
├─ NEW FIELDS:
│   ├─ careerGoal: String 
│   │   Options: "fullstack", "frontend", "backend", "data-science", 
│   │            "ml-ai", "devops", "mobile-dev", "cybersecurity", "other"
│   │
│   ├─ aim: String
│   │   Options: "placements", "higher-studies", "startup", "freelancing"
│   │
│   ├─ skills: [String] (may exist - tags like React, Node, Python)
│   │
│   ├─ interests: [String] (areas they want to explore)
│   │
│   └─ profileCompleted: Boolean (true if all required fields filled)
```

### Recommendation Output Structure (What LLM Returns)
```json
{
  "learningPath": {
    "phase1": { 
      "title": "Foundation", 
      "duration": "2 months", 
      "topics": ["HTML/CSS", "JavaScript Basics", "Git"] 
    },
    "phase2": { 
      "title": "Core Skills", 
      "duration": "3 months", 
      "topics": ["React", "Node.js", "Databases"] 
    },
    "phase3": { 
      "title": "Advanced", 
      "duration": "2 months", 
      "topics": ["System Design", "DevOps Basics", "Testing"] 
    }
  },
  "trendingSkills": ["Next.js", "TypeScript", "Docker", "AWS", "GraphQL"],
  "projectIdeas": [
    { 
      "title": "E-commerce Platform", 
      "difficulty": "Intermediate", 
      "skills": ["React", "Node.js", "MongoDB"],
      "description": "Build a full-stack shopping platform with auth, cart, payments"
    },
    { 
      "title": "Real-time Chat App", 
      "difficulty": "Intermediate", 
      "skills": ["Socket.io", "React", "Express"],
      "description": "Create a WhatsApp-like chat application"
    }
  ],
  "resources": [
    { "name": "freeCodeCamp", "type": "course", "url": "https://freecodecamp.org", "free": true },
    { "name": "The Odin Project", "type": "curriculum", "url": "https://theodinproject.com", "free": true }
  ],
  "exploreAreas": ["System Design", "Cloud Computing", "Open Source Contribution"],
  "careerInsights": "Brief paragraph about job market, expected salary range, companies hiring"
}
```

### Recommendation Storage (in User Model)
```
recommendations: {
  data: { ... },              // The actual recommendation JSON
  generatedAt: Date,          // When it was generated
  expiresAt: Date,            // 30 days from generation
  provider: String,           // "gemini" | "groq" | "rule-based"
  profileSnapshot: {          // To detect significant changes
    careerGoal: String,
    aim: String,
    skills: [String],
    year: Number
  },
  lastManualRefresh: Date     // For rate-limiting refresh button
}
```

### Significant Change Detection Logic
```
shouldRegenerate = (
  currentProfile.careerGoal !== snapshot.careerGoal ||
  currentProfile.aim !== snapshot.aim ||
  currentProfile.year !== snapshot.year ||
  (currentProfile.skills.length - snapshot.skills.length) >= 3
)
```

### Profile Completion Criteria
```
isProfileComplete = (
  user.branch &&
  user.year &&
  user.careerGoal &&
  user.aim &&
  user.skills.length >= 1
)
```

---

## 🛠 Implementation Order (Step by Step)

### Phase 1: Backend Foundation
1. Update User model with new fields
2. Update profile controller to handle new fields
3. Create recommendation service with LLM integration
4. Setup Gemini API integration
5. Setup Groq API as fallback
6. Create rule-based fallback system

### Phase 2: Recommendation Logic
1. Create prompt template for LLM
2. Implement caching logic (check before calling LLM)
3. Implement significant change detection
4. Implement refresh rate limiting (7-day cooldown)
5. Add error handling with fallback chain

### Phase 3: Frontend Updates
1. Update Profile page with new fields (careerGoal, aim dropdowns)
2. Add "Profile Incomplete" banner if not complete
3. Create "Generate Recommendations" button
4. Create recommendations display component
5. Add loading state during LLM call
6. Add "Refresh Recommendations" with cooldown message

### Phase 4: Polish
1. Add analytics (track which provider was used)
2. Test fallback scenarios
3. Optimize prompts for better output
4. Mobile responsiveness for recommendations UI

---

## 🔑 API Keys Needed
```
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

## 📦 NPM Packages to Install
```
Server:
- @google/generative-ai (for Gemini)
- groq-sdk (for Groq)
```

---

## 💡 Additional Ideas (Future)
- Weekly email with updated recommendations
- Compare your skills with placed seniors
- Skill gap analysis based on job postings
- Community-contributed resources voting

## Frontend Structure:

Pages
└─ Profile.jsx
   ├─ Recommendations Section (main feature)
   │  ├─ Loading state (skeleton UI)
   │  ├─ Tabbed interface (Technical/Soft/Projects/Certifications)
   │  ├─ Priority-based grouping (High/Medium/Low)
   │  ├─ Progress tracker (circular progress bar)
   │  └─ Refresh button (with cooldown timer)
   │
   ├─ Learning Path Section
   │  ├─ Phase 1, 2, 3 roadmap
   │  └─ Visual timeline
   │
   └─ Progress Dashboard
      ├─ Skills completed vs recommended
      ├─ Completion badges
      └─ Next recommended actions

Components
├─ SkillCard.jsx (individual skill display with resources)
├─ ProgressTracker.jsx (visual progress indicators)
├─ RefreshButton.jsx (with cooldown state)
└─ LoadingSkeleton.jsx (while fetching)

Services
└─ recommendationService.js
   ├─ API call wrappers
   ├─ Error handling
   └─ Response caching (session storage, NOT localStorage)

State Management
└─ React Context (AuthContext already exists)
   ├─ User profile data
   └─ Recommendation state (no Redux needed for this)