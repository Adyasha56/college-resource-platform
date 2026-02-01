# 🎓 EduHub - College Resource Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)

**A comprehensive academic resource platform for college students**

[Live Demo](#) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Reference](#-api-endpoints)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Authentication Flow](#-authentication-flow)
- [Application Flow](#-application-flow)
- [Screenshots](#-screenshots)
- [Upcoming Features](#-upcoming-features)
- [Contributing](#-contributing)
- [Contact](#-contact)

---

## 🎯 About

**EduHub** is a centralized platform designed to help college students easily access and share academic resources. The platform provides:

- Previous year question papers organized by year, semester, and branch
- Placement records with company details, packages, and required skills
- Personalized skill recommendations based on student profile
- Secure authentication for students and administrators
- Community Support 

In short : 

EduHub is a personalized academic collaboration platform that helps students discover the right resources at the right time using community-driven learning and intelligent recommendations.

---

## ✨ Features

### 🟢 Live Features

| Feature | Description |
|---------|-------------|
| **User Authentication** | Secure JWT-based login/register for students |
| **Admin Dashboard** | Separate admin panel for content management |
| **Question Papers** | Browse, filter, and download previous year papers |
| **Placement Records** | View placement statistics, companies, and packages |
| **Skill Recommendations** | Get personalized suggestions based on year & branch |
| **Profile Management** | View and manage user profile |
| **Secure Downloads** | Authenticated file downloads with logging |
| **Responsive Sidebar** | Navigation sidebar for logged-in users |

### 🔐 Role-Based Access

| Role | Permissions |
|------|-------------|
| **Guest** | View homepage, login/register |
| **Student** | Download papers, view placements, get recommendations |
| **Admin** | Upload papers, manage placements, view analytics |

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | UI Library |
| **Vite** | 6.3.5 | Build Tool & Dev Server |
| **React Router DOM** | 7.7.1 | Client-side Routing |
| **Tailwind CSS** | 4.1.10 | Utility-first CSS |
| **Framer Motion** | 12.23.12 | Animations |
| **Lucide React** | 0.525.0 | Icons |
| **React Icons** | 5.5.0 | Additional Icons |
| **Axios** | 1.11.0 | HTTP Client |
| **React Query** | 5.83.0 | Server State Management |
| **React Hot Toast** | 2.5.2 | Toast Notifications |
| **Socket.io Client** | 4.8.1 | Real-time Communication |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | Runtime Environment |
| **Express.js** | 4.21.2 | Web Framework |
| **MongoDB** | 6.17.0 | Database Driver |
| **Mongoose** | 8.16.5 | ODM for MongoDB |
| **JWT** | 9.0.2 | Authentication Tokens |
| **bcryptjs** | 3.0.2 | Password Hashing |
| **Cloudinary** | 1.30.0 | File Storage (PDFs) |
| **Multer** | 2.0.2 | File Upload Handling |
| **CORS** | 2.8.5 | Cross-Origin Requests |
| **Socket.io** | 4.8.1 | Real-time Events |

### DevOps & Tools

| Tool | Purpose |
|------|---------|
| **MongoDB Atlas** | Cloud Database |
| **Cloudinary** | Cloud File Storage |
| **Vercel** | Frontend Deployment |
| **Render** | Backend Deployment |
| **Nodemon** | Development Server |
| **ESLint** | Code Linting |

---

## 📁 Project Structure

```
college-resource-platform/
├── client/                          # Frontend (React + Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images, fonts
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.jsx           # Top navigation bar
│   │   │   ├── Sidebar.jsx          # Side navigation (logged-in users)
│   │   │   ├── Footer.jsx           # Footer component
│   │   │   └── AdminNavbar.jsx      # Admin navigation
│   │   ├── context/                 # React Context
│   │   │   ├── AuthContext.jsx      # User authentication state
│   │   │   └── AdminAuthContext.jsx # Admin authentication state
│   │   ├── features/
│   │   │   └── auth/                # Authentication pages
│   │   │       ├── Login.jsx
│   │   │       └── Register.jsx
│   │   ├── layout/                  # Layout components
│   │   │   ├── MainLayout.jsx       # Main app layout
│   │   │   └── AdminLayout.jsx      # Admin panel layout
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Profile.jsx          # User profile
│   │   │   ├── QuestionPapers.jsx   # Browse/download papers
│   │   │   ├── Placements.jsx       # Placement records
│   │   │   ├── NotFound.jsx         # 404 page
│   │   │   └── admin/               # Admin pages
│   │   │       ├── Dashboard.jsx
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── UploadPapers.jsx
│   │   │       └── AdminPlacements.jsx
│   │   ├── routes/                  # Route definitions
│   │   │   ├── AppRoutes.jsx        # Main routes
│   │   │   └── AdminRoutes.jsx      # Admin routes
│   │   ├── services/                # API services
│   │   │   ├── axiosInstance.js     # Axios configuration
│   │   │   └── tokenManager.js      # Token handling
│   │   ├── styles/                  # Additional styles
│   │   ├── App.jsx                  # Root component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json                  # Vercel deployment config
│
├── server/                          # Backend (Node.js + Express)
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── cloudinary.js            # Cloudinary configuration
│   ├── controllers/                 # Route handlers
│   │   ├── authController.js        # Auth logic
│   │   ├── adminController.js       # Admin operations
│   │   ├── questionController.js    # Question paper CRUD
│   │   ├── placementController.js   # Placement CRUD
│   │   ├── downloadController.js    # File download logic
│   │   └── recommendationController.js # Skill recommendations
│   ├── data/
│   │   └── recommendations.json     # Skill/project recommendations data
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── adminMiddleware.js       # Admin-only access
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js                  # Student model
│   │   ├── Admin.js                 # Admin model
│   │   ├── QuestionPaper.js         # Question paper model
│   │   ├── PlacementRecord.js       # Placement model
│   │   └── DownloadLog.js           # Download tracking
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── placementRoutes.js
│   │   ├── downloadRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── testUserRoute.js
│   ├── server.js                    # Entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary account
- Git

### Clone Repository

```bash
git clone https://github.com/Adyasha56/college-resource-platform.git
cd college-resource-platform
```

### Backend Setup

```bash
cd server
npm install
```

Create `.env` file in server directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eduhub
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start server:

```bash
npm run dev
# or
node server.js
```

### Frontend Setup

```bash
cd client
npm install
```

Create `.env` file in client directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Start development server:

```bash
npm run dev
```

---

## 🔑 Environment Variables

### Server (.env)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CLIENT_URL` | Frontend URL for CORS |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Client (.env)

| Variable | Description |
|----------|-------------|
| `VITE_BACKEND_URL` | Backend API URL |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new student | ❌ |
| POST | `/api/auth/login` | Student login | ❌ |
| POST | `/api/auth/admin-login` | Admin login | ❌ |
| GET | `/api/auth/validate` | Validate JWT token | ✅ |

### Question Papers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/questionpapers` | Get all papers | ❌ |
| GET | `/api/questionpapers/:id` | Get paper by ID | ❌ |
| POST | `/api/questionpapers/upload` | Upload new paper | Admin |
| DELETE | `/api/questionpapers/:id` | Delete paper | Admin |

### Placements

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/placements` | Get all placements | ❌ |
| POST | `/api/placements` | Add placement record | Admin |
| PUT | `/api/placements/:id` | Update placement | Admin |
| DELETE | `/api/placements/:id` | Delete placement | Admin |

### Downloads

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/downloads/questionpaper/:id` | Download paper | ✅ |

### Recommendations

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/recommendations` | Get personalized recommendations | ✅ |

---

## 🗄 Database Schema

### User (Student)

```javascript
{
  name: String,           // Required
  email: String,          // Required, unique
  password: String,       // Hashed with bcrypt
  year: Number,           // 1-4
  branch: String,         // CSE, ECE, etc.
  role: "student",        // Default
  createdAt: Date,
  updatedAt: Date
}
```

### Admin

```javascript
{
  name: String,
  email: String,          // Unique
  password: String,       // Hashed
  createdAt: Date,
  updatedAt: Date
}
```

### QuestionPaper

```javascript
{
  year: Number,           // Academic year (1-4)
  semester: Number,       // 1-8
  branch: String,         // CSE, ECE, etc.
  examType: String,       // "modular" or "end semester"
  subject: String,
  fileUrl: String,        // Cloudinary URL
  uploadedBy: ObjectId,   // Reference to Admin
  createdAt: Date
}
```

### PlacementRecord

```javascript
{
  company: String,
  branch: String,
  year: Number,
  ctc: String,            // Package offered
  requiredSkills: [String],
  description: String,
  eligibleBranches: [String],
  studentsSelected: [{
    name: String,
    branch: String,
    year: Number,
    skills: [String],
    package: String
  }],
  createdAt: Date
}
```

### DownloadLog

```javascript
{
  userId: ObjectId,       // Reference to User
  resourceId: ObjectId,   // Paper ID
  resourceType: String,   // "questionPaper" or "note"
  createdAt: Date
}
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. REGISTRATION                                             │
│     User → POST /api/auth/register                           │
│          → Password hashed (bcrypt)                          │
│          → User saved to MongoDB                             │
│          → JWT token generated (7 days expiry)               │
│          → Token + User data returned                        │
│                                                              │
│  2. LOGIN                                                    │
│     User → POST /api/auth/login                              │
│          → Email/password verified                           │
│          → JWT token generated                               │
│          → Token stored in localStorage                      │
│                                                              │
│  3. PROTECTED ROUTES                                         │
│     Request → Authorization: Bearer <token>                  │
│            → authMiddleware verifies JWT                     │
│            → If valid: req.user = decoded token              │
│            → If invalid: 401 Unauthorized                    │
│                                                              │
│  4. TOKEN STRUCTURE                                          │
│     {                                                        │
│       id: "user_id",                                         │
│       role: "student" | "admin",                             │
│       year: 1-4,                                             │
│       branch: "CSE"                                          │
│     }                                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER JOURNEY                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  GUEST USER                                                  │
│  ├── Homepage (Features, FAQ, Notify signup)                 │
│  ├── Login / Register                                        │
│  └── Cannot access: Papers, Placements, Profile              │
│                                                              │
│  LOGGED-IN STUDENT                                           │
│  ├── Navbar: Profile icon                                    │
│  ├── Sidebar: Question Papers, Placements, Logout            │
│  ├── Download papers (logged & tracked)                      │
│  ├── View placement records                                  │
│  ├── Get personalized skill recommendations                  │
│  └── Manage profile                                          │
│                                                              │
│  ADMIN                                                       │
│  ├── Separate login (/admin/login)                           │
│  ├── Dashboard with statistics                               │
│  ├── Upload question papers (PDF → Cloudinary)               │
│  ├── Manage placement records (CRUD)                         │
│  └── View download analytics                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Screenshots

> *Screenshots will be added after UI finalization*

| Page | Description |
|------|-------------|
| Homepage | Landing page with features & FAQ |
| Login | Student authentication |
| Question Papers | Browse & download papers |
| Placements | View placement records |
| Profile | User profile with recommendations |
| Admin Dashboard | Content management |

---

## 🚧 Upcoming Features

### In Development

| Feature | Status | Description |
|---------|--------|-------------|
| 🤖 ML Recommendations | 🔄 Design | AI-powered skill suggestions |
| 👥 Alumni Connect | 🔄 Design | Connect with placed seniors |
| 💬 Community Forum | 📋 Planned | Student discussions |
| 📝 Notes Upload | 📋 Planned | Share study notes |
| ⭐ Resource Ratings | 📋 Planned | Rate and review materials |
| 📊 Analytics Dashboard | 📋 Planned | User engagement metrics |
| 🔔 Push Notifications | 📋 Planned | New resource alerts |
| 📱 Mobile App | 📋 Planned | React Native version |

### Future Roadmap

1. **Phase 1** (Current): Core features - Papers, Placements, Auth ✅
2. **Phase 2** (Q2 2026): ML Recommendations, Alumni Network
3. **Phase 3** (Q3 2026): Community Forum, Notes sharing
4. **Phase 4** (Q4 2026): Mobile App, Advanced Analytics

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Use meaningful commit messages
- Write clean, documented code
- Test before submitting PR

---

## 📬 Contact

**Adyasha Nanda**

- 📧 Email: nandaadyasha71@gmail.com
- 🐙 GitHub: [@Adyasha56](https://github.com/Adyasha56)

---

## 📄 License

This project is licensed under the ISC License.

---

<div align="center">

**Made with ❤️ for students, by a student**

⭐ Star this repo if you find it helpful!

</div>

---
