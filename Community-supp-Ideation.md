┌─────────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React + Vite)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  NAVIGATION                                                                  │
│  ├─                                                              │
│  │   └─ Add "Community" in the sidebar                                               │
│  │                                                                           │
│  PAGES                                                                       │
│  ├─ Community.jsx (MAIN PAGE - NEW)                                        │
│  │   ├─ FeedContainer                                                       │
│  │   ├─ CreatePostButton                                                    │
│  │   └─ FilterBar                                                           │
│  │                                                                           │
│  ├─ PostDetail.jsx (NEW)                                                    │
│  │   ├─ Full post view                                                      │
│  │   ├─ Comments section                                                    │
│  │   └─ Related posts                                                       │
│  │                                                                           │
│  COMPONENTS                                                                  │
│  ├─ Feed/                                                                    │
│  │   ├─ FeedContainer.jsx (NEW)                                            │
│  │   │   ├─ Infinite scroll                                                │
│  │   │   ├─ Post list                                                       │
│  │   │   └─ Loading states                                                 │
│  │   │                                                                      │
│  │   ├─ PostCard.jsx (NEW)                                                 │
│  │   │   ├─ Post type badge                                                │
│  │   │   ├─ Content display                                                │
│  │   │   ├─ Like button                                                    │
│  │   │   ├─ Comment count                                                  │
│  │   │   └─ Author info                                                    │
│  │   │                                                                      │
│  │   └─ FilterBar.jsx (NEW)                                                │
│  │       ├─ Type filter                                                    │
│  │       ├─ Branch filter                                                  │
│  │       ├─ Year filter                                                    │
│  │       ├─ Tag search                                                     │
│  │       └─ Sort options                                                   │
│  │                                                                          │
│  ├─ Post/                                                                   │
│  │   ├─ CreatePostModal.jsx (NEW)                                          │
│  │   │   ├─ Post type selector                                             │
│  │   │   ├─ Title input                                                    │
│  │   │   ├─ Content textarea                                               │
│  │   │   ├─ Image upload                                                   │
│  │   │   ├─ Tags input                                                     │
│  │   │   └─ Submit button                                                  │
│  │   │                                                                      │
│  │   └─ PostActions.jsx (NEW)                                              │
│  │       ├─ Like button                                                    │
│  │       ├─ Comment button                                                 │
│  │       ├─ Share button                                                   │
│  │       └─ Report button                                                  │
│  │                                                                          │
│  ├─ Comment/                                                                │
│  │   ├─ CommentSection.jsx (NEW)                                           │
│  │   │   ├─ Comment list                                                   │
│  │   │   ├─ Pagination                                                     │
│  │   │   └─ Add comment form                                               │
│  │   │                                                                      │
│  │   ├─ CommentCard.jsx (NEW)                                              │
│  │   │   ├─ Comment content                                                │
│  │   │   ├─ Like button                                                    │
│  │   │   ├─ Reply button                                                   │
│  │   │   └─ Author info                                                    │
│  │   │                                                                      │
│  │   └─ AddCommentForm.jsx (NEW)                                           │
│  │       ├─ Textarea                                                       │
│  │       └─ Submit button                                                  │
│  │                                                                          │
│  └─ Shared/                                                                 │
│      ├─ ImageUploader.jsx (NEW)                                            │
│      ├─ TagInput.jsx (NEW)                                                 │
│      ├─ UserBadge.jsx (NEW)                                                │
│      └─ EmptyState.jsx (NEW)                                               │
│                                                                              │
│  SERVICES                                                                    │
│  ├─ communityService.js (NEW)                                              │
│  │   ├─ getFeed(filters)                                                   │
│  │   ├─ getPost(postId)                                                    │
│  │   ├─ createPost(data)                                                   │
│  │   ├─ updatePost(id, data)                                               │
│  │   ├─ deletePost(id)                                                     │
│  │   ├─ toggleLike(targetId, type)                                         │
│  │   ├─ addComment(postId, content)                                        │
│  │   └─ reportContent(id, type, reason)                                    │
│  │                                                                          │
│  STATE MANAGEMENT                                                           │
│  └─ Context/CommunityContext.jsx (NEW)                                     │
│      ├─ Posts state                                                         │
│      ├─ Filters state                                                       │
│      ├─ Loading states                                                      │
│      └─ User stats                                                          │
│                                                                              │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               │ HTTP Requests (Axios)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js + Express)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ROUTES                                                                      │
│  ├─ /api/posts (NEW)                                                        │
│  │   ├─ GET    /           → Get feed with filters                         │
│  │   ├─ GET    /:postId    → Get single post                               │
│  │   ├─ POST   /           → Create post (rate limited)                    │
│  │   ├─ PUT    /:postId    → Update post (owner only)                      │
│  │   ├─ DELETE /:postId    → Delete post (owner/admin)                     │
│  │   └─ PATCH  /:postId/mark-answered → Mark question answered             │
│  │                                                                          │
│  ├─ /api/comments (NEW)                                                     │
│  │   ├─ GET    /post/:postId → Get comments for post                       │
│  │   ├─ POST   /post/:postId → Add comment                                 │
│  │   ├─ PUT    /:commentId   → Update comment (owner only)                 │
│  │   └─ DELETE /:commentId   → Delete comment (owner/admin)                │
│  │                                                                          │
│  ├─ /api/likes (NEW)                                                        │
│  │   ├─ POST   /toggle      → Toggle like/unlike                           │
│  │   └─ GET    /my-liked-posts → Get user's liked posts                    │
│  │                                                                          │
│  └─ /api/reports (NEW - Phase 2)                                           │
│      ├─ POST   /           → Report content                                │
│      └─ GET    /pending    → Get pending reports (admin)                   │
│                                                                              │
│  CONTROLLERS                                                                 │
│  ├─ postController.js (NEW)                                                │
│  │   ├─ getFeed()                                                           │
│  │   ├─ getPost()                                                           │
│  │   ├─ createPost()                                                        │
│  │   ├─ updatePost()                                                        │
│  │   ├─ deletePost()                                                        │
│  │   └─ markAsAnswered()                                                    │
│  │                                                                          │
│  ├─ commentController.js (NEW)                                             │
│  │   ├─ getComments()                                                       │
│  │   ├─ createComment()                                                     │
│  │   ├─ updateComment()                                                     │
│  │   └─ deleteComment()                                                     │
│  │                                                                          │
│  └─ likeController.js (NEW)                                                │
│      ├─ toggleLike()                                                        │
│      └─ getUserLikedPosts()                                                 │
│                                                                              │
│  MIDDLEWARE                                                                  │
│  ├─ authMiddleware.js (EXISTING)                                           │
│  │   └─ authenticateUser()                                                  │
│  │                                                                          │
│  ├─ validationMiddleware.js (NEW)                                          │
│  │   ├─ validatePost()                                                      │
│  │   └─ validateComment()                                                   │
│  │                                                                          │
│  └─ rateLimitMiddleware.js (NEW)                                           │
│      ├─ postRateLimit (5 posts/day)                                        │
│      └─ likeRateLimit (50 likes/min)                                       │
│                                                                              │
│  UTILITIES                                                                   │
│  ├─ imageUpload.js (Reuse Cloudinary config)                               │
│  ├─ badWords.js (Spam filter)                                              │
│  └─ notifications.js (Phase 2)                                             │
│                                                                              │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               │ Database Operations
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB Atlas)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  COLLECTIONS                                                                 │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────┐            │
│  │ posts (NEW)                                                 │            │
│  ├────────────────────────────────────────────────────────────┤            │
│  │ {                                                           │            │
│  │   _id: ObjectId,                                           │            │
│  │   author: {                                                 │            │
│  │     userId: ObjectId (ref: User),                          │            │
│  │     name: String,                                           │            │
│  │     branch: String,                                         │            │
│  │     year: Number                                            │            │
│  │   },                                                        │            │
│  │   type: String, // discussion|question|achievement|        │            │
│  │                 // resource|project                         │            │
│  │   title: String,                                            │            │
│  │   content: String,                                          │            │
│  │   images: [{ url, publicId }],                             │            │
│  │   tags: [String],                                           │            │
│  │   likeCount: Number,                                        │            │
│  │   commentCount: Number,                                     │            │
│  │   viewCount: Number,                                        │            │
│  │   isAnswered: Boolean,                                      │            │
│  │   isPinned: Boolean,                                        │            │
│  │   isHidden: Boolean,                                        │            │
│  │   reportCount: Number,                                      │            │
│  │   createdAt: Date,                                          │            │
│  │   updatedAt: Date                                           │            │
│  │ }                                                           │            │
│  │                                                             │            │
│  │ Indexes:                                                    │            │
│  │ • { createdAt: -1 }           // Sort by recent            │            │
│  │ • { likeCount: -1 }           // Sort by popular           │            │
│  │ • { type: 1, createdAt: -1 }  // Filter by type            │            │
│  │ • { 'author.branch': 1 }      // Filter by branch          │            │
│  │ • { 'author.year': 1 }        // Filter by year            │            │
│  │ • { tags: 1 }                 // Search by tags            │            │
│  │ • { 'author.userId': 1 }      // User's posts              │            │
│  └────────────────────────────────────────────────────────────┘            │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────┐            │
│  │ comments (NEW)                                              │            │
│  ├────────────────────────────────────────────────────────────┤            │
│  │ {                                                           │            │
│  │   _id: ObjectId,                                           │            │
│  │   postId: ObjectId (ref: Post),                            │            │
│  │   author: {                                                 │            │
│  │     userId: ObjectId (ref: User),                          │            │
│  │     name: String,                                           │            │
│  │     branch: String,                                         │            │
│  │     year: Number                                            │            │
│  │   },                                                        │            │
│  │   content: String,                                          │            │
│  │   likeCount: Number,                                        │            │
│  │   isHidden: Boolean,                                        │            │
│  │   reportCount: Number,                                      │            │
│  │   createdAt: Date,                                          │            │
│  │   updatedAt: Date                                           │            │
│  │ }                                                           │            │
│  │                                                             │            │
│  │ Indexes:                                                    │            │
│  │ • { postId: 1, createdAt: 1 } // Get post's comments       │            │
│  │ • { 'author.userId': 1 }      // User's comments            │            │
│  └────────────────────────────────────────────────────────────┘            │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────┐            │
│  │ likes (NEW)                                                 │            │
│  ├────────────────────────────────────────────────────────────┤            │
│  │ {                                                           │            │
│  │   _id: ObjectId,                                           │            │
│  │   userId: ObjectId (ref: User),                            │            │
│  │   targetId: ObjectId, // Post or Comment                   │            │
│  │   targetType: String, // 'post' | 'comment'                │            │
│  │   createdAt: Date                                           │            │
│  │ }                                                           │            │
│  │                                                             │            │
│  │ Indexes:                                                    │            │
│  │ • { userId: 1, targetId: 1, targetType: 1 } UNIQUE         │            │
│  │ • { targetId: 1, targetType: 1 } // Count likes            │            │
│  │ • { userId: 1 }                  // User's likes            │            │
│  └────────────────────────────────────────────────────────────┘            │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────┐            │
│  │ reports (NEW - Phase 2)                                     │            │
│  ├────────────────────────────────────────────────────────────┤            │
│  │ {                                                           │            │
│  │   _id: ObjectId,                                           │            │
│  │   reportedBy: ObjectId (ref: User),                        │            │
│  │   targetId: ObjectId,                                       │            │
│  │   targetType: String, // 'post' | 'comment'                │            │
│  │   reason: String, // spam|inappropriate|harassment|etc     │            │
│  │   description: String,                                      │            │
│  │   status: String, // pending|reviewed|dismissed|etc        │            │
│  │   reviewedBy: ObjectId,                                     │            │
│  │   reviewedAt: Date,                                         │            │
│  │   createdAt: Date                                           │            │
│  │ }                                                           │            │
│  │                                                             │            │
│  │ Indexes:                                                    │            │
│  │ • { status: 1, createdAt: -1 }                             │            │
│  │ • { targetId: 1, targetType: 1 }                           │            │
│  └────────────────────────────────────────────────────────────┘            │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────┐            │
│  │ users (UPDATE EXISTING)                                     │            │
│  ├────────────────────────────────────────────────────────────┤            │
│  │ Add new fields:                                             │            │
│  │                                                             │            │
│  │ communityStats: {                                           │            │
│  │   postsCount: Number,                                       │            │
│  │   commentsCount: Number,                                    │            │
│  │   likesReceived: Number,                                    │            │
│  │   helpfulAnswers: Number                                    │            │
│  │ },                                                          │            │
│  │                                                             │            │
│  │ badges: [{                                                  │            │
│  │   type: String,                                             │            │
│  │   earnedAt: Date                                            │            │
│  │ }],                                                         │            │
│  │                                                             │            │
│  │ // Rate limiting                                            │            │
│  │ lastPostTime: Date,                                         │            │
│  │ postsToday: Number,                                         │            │
│  │                                                             │            │
│  │ // Moderation                                               │            │
│  │ isModerator: Boolean,                                       │            │
│  │ isBanned: Boolean,                                          │            │
│  │ bannedUntil: Date                                           │            │
│  └────────────────────────────────────────────────────────────┘            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘