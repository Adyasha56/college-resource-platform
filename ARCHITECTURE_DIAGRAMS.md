# 🎯 Recommendation Feature - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Profile.jsx                  EditProfileModal.jsx         │
│  ├─ Recommendation UI         ├─ Career Goal dropdown      │
│  ├─ Get Recommendations btn   ├─ Aim dropdown (NEW)       │
│  ├─ Refresh button            └─ Skills input             │
│  └─ Error display                                         │
│         │                                                  │
│         └─> RecommendationCard.jsx (NEW)                 │
│            ├─ Learning Path Tab                          │
│            ├─ Skills Tab                                 │
│            ├─ Projects Tab                               │
│            ├─ Resources Tab                              │
│            └─ Insights Tab                               │
│                                                           │
└──────────────┬──────────────────────────────────────────────┘
               │ API Calls
               ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND - Recommendation Routes                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  GET  /api/recommendations                                 │
│  └─> recommendationController.getRecommendations()         │
│       ├─ Validate auth                                     │
│       ├─ Check profile complete                            │
│       ├─ Validate cache                                    │
│       └─ Return recommendations                            │
│                                                             │
│  POST /api/recommendations/refresh (NEW)                   │
│  └─> recommendationController.refreshRecommendations()     │
│       ├─ Validate auth                                     │
│       ├─ Check rate limit (7 days)                         │
│       ├─ Generate fresh                                    │
│       └─ Update lastManualRefresh                          │
│                                                             │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│         Recommendation Service Logic (NEW)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  generateRecommendations(user, forceRefresh)               │
│  │                                                         │
│  ├─ Check rate limit                                       │
│  │                                                         │
│  ├─ Decide: Use cache or generate?                         │
│  │   └─ shouldRegenerate() checks:                         │
│  │      ├─ Cache exists?                                   │
│  │      ├─ Not expired? (30 days)                          │
│  │      ├─ Profile unchanged?                              │
│  │      └─ forceRefresh = false?                           │
│  │                                                         │
│  └─ If generate needed: FALLBACK CHAIN                     │
│     │                                                      │
│     ├─ 1️⃣ Try Gemini 2.0 Flash                            │
│     │   └─ generateViaGemini(user)                         │
│     │      └─ Success? Return ✓                            │
│     │                                                      │
│     ├─ 2️⃣ Try Groq Llama 3.3                              │
│     │   └─ generateViaGroq(user)                           │
│     │      └─ Success? Return ✓                            │
│     │                                                      │
│     └─ 3️⃣ Use Rule-Based System                           │
│         └─ generateRuleBased(user)                         │
│            └─ Load from recommendations.json              │
│                                                             │
│  Return: {                                                  │
│    data: {...recommendations...},                          │
│    generatedAt: Date,                                      │
│    expiresAt: Date,                                        │
│    provider: "gemini|groq|rule-based",                     │
│    profileSnapshot: {...profile state...}                  │
│  }                                                         │
│                                                             │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│         Database - User Model (MongoDB)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User Document:                                            │
│  {                                                         │
│    _id: ObjectId,                                          │
│    name, email, password,                                  │
│    year, branch,                                           │
│    careerGoal, aim (NEW),                                  │
│    skills: [...],                                         │
│    interestedFields: [...],                               │
│    customInterests: [...],                                │
│                                                             │
│    recommendations: {          ◄── NEW NESTED OBJECT      │
│      data: {...},              │ Full recommendations      │
│      generatedAt: Date,        │ Cache timestamp           │
│      expiresAt: Date,          │ Expiration timestamp      │
│      provider: String,         │ Which LLM was used       │
│      profileSnapshot: {        │ State when generated     │
│        careerGoal,             │ For change detection     │
│        aim,                    │                          │
│        skills: [...],          │                          │
│        year                    │                          │
│      },                        │                          │
│      lastManualRefresh: Date   │ Rate limit tracking      │
│    }                           │                          │
│  }                                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Request Flow - First Time

```
User Completes Profile
  │ (Fills: career goal, aim, ≥1 skill)
  ▼
Click "Get Recommendations"
  │
  ▼ Frontend: GET /api/recommendations
Backend Controller
  │
  ├─ Auth check ✓
  │
  ├─ Profile Complete?
  │  └─ YES ✓ → Continue
  │
  ├─ Check DB: Does cache exist?
  │  └─ NO → Need to generate
  │
  ▼ Call generateRecommendations()
  │
  ├─ Try Gemini
  │  ├─ API Key exists? ✓
  │  ├─ Send profile + prompt
  │  ├─ Get back JSON response
  │  └─ Success ✓ Return
  │
  ▼ Save to DB with metadata
  │  - generatedAt: now
  │  - expiresAt: now + 30 days
  │  - provider: "gemini"
  │  - profileSnapshot: current state
  │  - lastManualRefresh: null
  │
  ▼ Return to Frontend
200 OK {
  data: {...recommendations...},
  cached: false,
  provider: "gemini",
  generatedAt: "2024-01-31T10:00:00Z",
  expiresAt: "2024-03-02T10:00:00Z"
}
  │
  ▼ Frontend
Display RecommendationCard
  │ Shows all 5 tabs
  └─ Shows "✨ Fresh • Powered by gemini"
```

---

## Request Flow - Cached

```
User Clicks "Get Recommendations" Again (5 mins later)
  │
  ▼ Frontend: GET /api/recommendations
Backend Controller
  │
  ├─ Auth check ✓
  │
  ├─ Profile Complete? ✓
  │
  ├─ Check DB: Cache exists? ✓ YES
  │
  ├─ Call shouldRegenerate()
  │  ├─ Cache expired? (30 days)
  │  │  └─ NO → Still valid ✓
  │  │
  │  └─ Profile changed significantly?
  │     ├─ Career goal same? ✓
  │     ├─ Aim same? ✓
  │     ├─ Year same? ✓
  │     ├─ Skills count same? ✓
  │     └─ NO changes → Use cache ✓
  │
  ▼ Return cached from DB
200 OK {
  data: {...recommendations...},     ◄─ Same as before
  cached: true,                       ◄─ Indicates cache
  provider: "gemini",
  generatedAt: "2024-01-31T10:00:00Z",
  expiresAt: "2024-03-02T10:00:00Z"
}
  │
  ▼ Frontend (<100ms total)
Display RecommendationCard
  │ Shows all 5 tabs (same as before)
  └─ Shows "📦 Cached • Powered by gemini"
```

---

## Request Flow - Refresh (Manual)

```
User Clicks "Refresh Recommendations" Button
  │
  ▼ Frontend: POST /api/recommendations/refresh
Backend Controller
  │
  ├─ Auth check ✓
  │
  ├─ Check rate limit
  │  ├─ Is lastManualRefresh > 7 days ago?
  │  │
  │  ├─ NO (refreshed 3 days ago)
  │  │  └─ Return 429 Too Many Requests
  │  │     "Refresh available in 4 days"
  │  │     └─ Frontend shows error + countdown
  │  │
  │  └─ YES (refreshed 10 days ago)
  │     └─ Continue ✓
  │
  ▼ Call generateRecommendations(user, forceRefresh=true)
  │
  ├─ Skip cache check (forceRefresh = true)
  │
  ├─ Try Gemini → Success ✓
  │  └─ Return fresh data
  │
  ▼ Save to DB
  │  - Update data with fresh recommendations
  │  - Update generatedAt: now
  │  - Update expiresAt: now + 30 days
  │  - Update provider: "gemini"
  │  - Update profileSnapshot: current state ✓ IMPORTANT
  │  - Update lastManualRefresh: now ◄─ RESET COUNTER
  │
  ▼ Return to Frontend
200 OK {
  data: {...fresh recommendations...},
  provider: "gemini",
  generatedAt: "2024-01-31T10:30:00Z",
  message: "Recommendations refreshed successfully"
}
  │
  ▼ Frontend
Display new RecommendationCard
  │ Shows updated recommendations
  └─ Shows "✨ Fresh • Powered by gemini"
     (7-day counter reset)
```

---

## Fallback Chain Flow

```
User Requests Recommendations

generateRecommendations()
  │
  ├─ Check cache first (if not forceRefresh)
  │  └─ Valid cache exists? → Return cached ✓
  │
  ├─ LLM Generation Fallback Chain:
  │
  ├─ LEVEL 1: Try Gemini
  │  │
  │  ├─ Check: GEMINI_API_KEY exists?
  │  │  └─ NO → Skip to Groq
  │  │
  │  ├─ Call Google Generative AI API
  │  │
  │  ├─ Success?
  │  │  ├─ YES → Parse JSON ✓
  │  │  │        return { data, provider: "gemini" }
  │  │  │
  │  │  └─ NO (quota exceeded, network error, etc)
  │  │     └─ Continue to Groq
  │  │
  │  └─ Timeout? → Continue to Groq
  │
  ├─ LEVEL 2: Try Groq
  │  │
  │  ├─ Check: GROQ_API_KEY exists?
  │  │  └─ NO → Skip to Rule-based
  │  │
  │  ├─ Call Groq API (Llama 3.3)
  │  │
  │  ├─ Success?
  │  │  ├─ YES → Parse JSON ✓
  │  │  │        return { data, provider: "groq" }
  │  │  │
  │  │  └─ NO → Continue to Rule-based
  │  │
  │  └─ Timeout? → Continue to Rule-based
  │
  ├─ LEVEL 3: Use Rule-Based System
  │  │
  │  └─ Load from recommendations.json
  │     ├─ Find by branch + year
  │     └─ If not found, fallback to Year 1 basics
  │        return { data, provider: "rule-based" }
  │
  └─ All failed? (very rare)
     └─ Return 500 error + helpful message

Results:
✅ Provider = "gemini" (best quality, 2-3 sec)
✅ Provider = "groq" (good quality, 1-2 sec)
✅ Provider = "rule-based" (basic, instant)
❌ Provider = null (all failed - show error)
```

---

## Cache Invalidation Triggers

```
Profile Updated

Event: User saves profile with changes

Check: Has something significant changed?

┌─ Career Goal Changed?
│  ├─ OLD: "Placement"
│  ├─ NEW: "Higher Studies"
│  └─ YES → Invalidate Cache ✓
│
├─ Aim Changed?
│  ├─ OLD: "Startup"
│  ├─ NEW: "Freelancing"
│  └─ YES → Invalidate Cache ✓
│
├─ Year Increased?
│  ├─ OLD: 2
│  ├─ NEW: 3
│  └─ YES → Invalidate Cache ✓
│
├─ Skills Added (3+ new)?
│  ├─ OLD: 2 skills
│  ├─ NEW: 5 skills (added 3)
│  └─ YES → Invalidate Cache ✓
│
└─ Interests Changed?
   ├─ OLD: [Web Dev, AI/ML]
   ├─ NEW: [Web Dev, AI/ML] (same)
   └─ NO → Keep Cache ✓

If Invalidated:
Next GET /api/recommendations
→ shouldRegenerate() returns TRUE
→ New LLM call triggered
→ Fresh recommendations generated
→ Cache updated with new data
```

---

## State Machine - Recommendation Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│                  NO RECOMMENDATIONS                     │
│              (New user or fresh DB)                     │
└────────────────────┬────────────────────────────────────┘
                     │ GET /api/recommendations
                     ├─ Profile incomplete? → Return 400
                     │
                     └─ Generate via LLM
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  FRESH GENERATED                        │
│   (Just created via Gemini/Groq/Rule-based)            │
└────────────────────┬────────────────────────────────────┘
                     │ Time passes / User keeps using
                     │
                     ├─ GET requests → Serve cached
                     ├─ Profile unchanged → Cache valid
                     └─ Repeat up to 30 days
                        ▼
                     When one of:
                     ├─ 30 days pass
                     ├─ Career goal changes
                     ├─ Aim changes
                     ├─ Year increases
                     ├─ 3+ skills added
                     └─ User clicks refresh (7+ days)
                        ▼
┌─────────────────────────────────────────────────────────┐
│              REGENERATION TRIGGERED                     │
│         (Cache invalid, LLM called again)              │
└────────────────────┬────────────────────────────────────┘
                     │ Generate fresh via LLM
                     │ Update profileSnapshot
                     │ Reset expiresAt (30 days)
                     │ Update generatedAt
                     │
                     └─ Back to FRESH GENERATED state
```

---

## Error Handling Flow

```
User requests recommendations

┌─ Authentication failed?
│  └─ Return 401 Unauthorized
│
├─ Profile incomplete?
│  └─ Return 400 Bad Request
│     {
│       error: "Profile incomplete",
│       incompleteFields: {
│         careerGoal: false,
│         aim: false,
│         skills: true  ← This is missing
│       }
│     }
│
├─ Rate limit exceeded?
│  └─ Return 429 Too Many Requests
│     {
│       error: "Refresh available in 5 days",
│       nextRefreshDate: "2024-02-05T..."
│     }
│
├─ All LLMs failed?
│  └─ Return 500 Internal Server Error
│     {
│       error: "Failed to generate recommendations",
│       message: "Please try again later"
│     }
│
└─ Success!
   └─ Return 200 OK with recommendations
```

---

## Performance Timeline

```
FIRST REQUEST (LLM Generation)
├─ 0-50ms: Database lookup
├─ 50-100ms: Profile validation
├─ 100-200ms: LLM request sent
├─ 100-5000ms: Waiting for LLM response
│  ├─ Gemini: ~2-3 seconds
│  ├─ Groq: ~1-2 seconds
│  └─ Rule-based: <100ms
├─ 5000-5050ms: Parse response
├─ 5050-5100ms: Save to DB
└─ 5100ms TOTAL (approximately)

SECOND REQUEST (Cache)
├─ 0-50ms: Database lookup
├─ 50-100ms: Return from cache
└─ 100ms TOTAL ✓ (50x faster!)

REFRESH REQUEST (After 7 days)
├─ 0-50ms: Database lookup
├─ 50-100ms: Check rate limit
├─ 100-200ms: LLM request sent
├─ 100-5000ms: Waiting for LLM response
└─ 5100ms TOTAL (same as first request)
```

---

## Database Storage Impact

```
User Document Size:

Before Recommendations Feature:
├─ Basic fields: ~500 bytes
├─ Skills array: ~1KB
├─ Interests array: ~500 bytes
└─ Total: ~2KB

After Recommendations Feature:
├─ Previous: ~2KB
├─ recommendations.data: ~5-10KB (JSON)
├─ Profile metadata: ~500 bytes
└─ Total: ~7-12KB per user

Expected Dataset:
├─ 10,000 students
├─ Average: 10KB per document
└─ Total: ~100 MB (very manageable)

Index Strategy:
├─ recommendations.expiresAt (for cleanup)
├─ recommendations.generatedAt (for sorting)
└─ userId + createdAt (compound)
```

---

This documentation covers the complete architecture and data flow of the recommendation system!
