# 🚀 CAIA System Design Knowledge Base

## 🔗 Important Links

| Link | URL |
|------|-----|
| 🌐 **Frontend (Live)** | [https://caia-system-design.vercel.app](https://caia-system-design.vercel.app) |
| ⚙️ **Backend API (Live)** | [https://caia-system-design-mann-patel.onrender.com/](https://caia-system-design-mann-patel.onrender.com/) |
| 📘 **Postman Documentation** | [https://documenter.getpostman.com/view/50840766/2sBXwmQYQA](https://documenter.getpostman.com/view/50840766/2sBXwmQYQA) |
| 💻 **GitHub Repository** | [https://github.com/mann2007-ptl/caia_system_design_mann_patel](https://github.com/mann2007-ptl/caia_system_design_mann_patel) |
| 📂 **Dataset (Google Drive)** | [https://drive.google.com/file/d/1um-ZWp-i2SnDgYC1kOV2BOPcYhzInejV/view?usp=sharing](https://drive.google.com/file/d/1um-ZWp-i2SnDgYC1kOV2BOPcYhzInejV/view?usp=sharing) |
| 📘 **Assignment Repo** | [https://github.com/codinggita/CGxSU_Semester_1/tree/main/assignments/05.sem2_full_stack_80_Marks_Project_02](https://github.com/codinggita/CGxSU_Semester_1/tree/main/assignments/05.sem2_full_stack_80_Marks_Project_02) |

---

## 📌 Project Overview

**CAIA System Design Knowledge Base** is a full-stack application that provides a centralized platform for learning, exploring, and analyzing system design concepts.

The system is built on a **real-world dataset of system design prompts and detailed responses**, enabling users to search, filter, bookmark, and interact with high-quality architecture knowledge in a structured way. It features role-based access with both user and admin dashboards, comprehensive analytics, and a rich RESTful API with over 100+ endpoints.

---

## 🎯 Objectives

* Build a **scalable RESTful API system** with modular architecture
* Design schema based on **real dataset structure**
* Implement **advanced search & filtering** with fuzzy, regex, and autocomplete support
* Provide **analytics & trending insights** on concepts, categories, and user engagement
* Enable **user personalization** (bookmarks, notes, votes)
* Implement **role-based access** (User & Admin) with JWT authentication
* Follow **clean architecture & PR practices** throughout development

---

## ❓ Problem Statement

System design preparation is often scattered across multiple platforms with:

* ❌ No centralized knowledge base
* ❌ Poor search and filtering capabilities
* ❌ No structured categorization or taxonomy
* ❌ No tracking of important concepts or progress
* ❌ No personalized learning paths

---

## 💡 Solution

This project solves the problem by creating a **structured knowledge base system** where users can:

* Browse system design prompts across various categories and difficulty levels
* Read detailed explanations with rich markdown rendering
* Filter by category, concept, language, difficulty, and question type
* Search across prompts and responses with fuzzy, regex, and autocomplete
* Track trending and popular topics via analytics
* Bookmark, take notes, and vote on important content
* Follow curated learning roadmaps (Backend, Frontend, DevOps, System Design)
* Participate in daily system design challenges

---

## 🧠 Dataset Structure

The application is built on a structured JSON dataset with the following schema:

```json
{
  "prompt": "System design question",
  "response": "Detailed explanation with markdown",
  "metadata": {
    "category": "Foundations",
    "subcategory": "Scalability",
    "concept": "Horizontal vs vertical scaling",
    "question_type": "design",
    "language": "JavaScript",
    "difficulty": "Intermediate",
    "generated_at": "2025-08-20T17:49:57.932316"
  },
  "views": 0,
  "isBookmarked": false,
  "isArchived": false,
  "notes": [],
  "votes": 0
}
```

---

## 🗄️ Database Schema Design

### Prompt Model (`data` collection)

```js
{
  prompt: { type: String, required: true, index: true },
  response: { type: String, required: true },
  metadata: {
    category: { type: String, index: true },
    subcategory: String,
    concept: String,
    question_type: { type: String, index: true },
    language: { type: String, index: true },
    difficulty: { type: String, index: true },
    generated_at: Date
  },
  views: { type: Number, default: 0 },
  isBookmarked: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  notes: [{ text: String, createdAt: Date }],
  votes: { type: Number, default: 0 }
}
```

### User Model (`users` collection)

```js
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isEmailVerified: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date
}
```

### ✅ Key Design Decisions

* Used `prompt` + `response` instead of traditional title/body pattern
* Nested `metadata` for structured multi-field filtering
* Added `views`, `votes`, `isBookmarked` for analytics and personalization
* Used MongoDB indexes on frequently queried fields (`prompt`, `category`, `difficulty`, `language`, `question_type`)
- Separate `User` model with role-based access control (RBAC)
- Soft delete support via `isDeleted` and `isArchived` flags

---

## 🏗️ System Architecture

The project follows a **modular layered architecture**:

```
┌─────────────────────────────────────────────┐
│                Frontend (React)              │
│         Vite + Tailwind CSS + MUI           │
├─────────────────────────────────────────────┤
│              Backend (Express 5)             │
│      Controllers → Services → Models        │
├─────────────────────────────────────────────┤
│        Middleware Layer                      │
│   Auth | Admin | Logger | Cache | Rate Limit│
├─────────────────────────────────────────────┤
│             Database (MongoDB)               │
│           Mongoose ODM + Indexing           │
└─────────────────────────────────────────────┘
```

### Architecture Highlights

* **Frontend (React 19)** → UI rendering, state management (Redux Toolkit), routing (React Router 7)
* **Backend (Express 5)** → RESTful API with 16 controller modules
* **Database (MongoDB)** → Document storage with Mongoose ODM and indexed queries
* **Middleware Layer** → JWT authentication, admin authorization, request logging, rate limiting, caching
* **State Management** → Redux Toolkit with dedicated slices for auth, concepts, and admin
* **API Communication** → Axios with JWT interceptor for automatic token injection

---

## ✨ Features

### 🔹 Core Features

* Full CRUD operations on system design concepts
* Advanced search with fuzzy, regex, exact, and autocomplete modes
* Multi-dimensional filtering (category, difficulty, language, tags, date)
* Pagination with offset, cursor-based, and infinite scroll support
* Sorting by title, views, bookmarks, difficulty, category, language, popularity

### 🔹 User Features

* JWT-based authentication (register, login, logout, refresh tokens)
* Email verification and password reset flow
* Bookmark concepts for quick access
* Add personal notes to concepts
* Upvote/downvote on concepts
* Profile management
* View recently searched and popular search terms

### 🔹 Admin Features

* Admin dashboard with system stats and KPIs
* User management (view, ban, unban, role assignment)
* Concept management (create, edit, archive, restore, delete)
* Bulk operations on concepts (create, update, archive, delete)
* System health monitoring and cache management
* Reports and analytics views
* Bookmark analytics

### 🔹 Analytics & Discovery

* Trending concepts and popular topics
* Category distribution and difficulty stats
* Top patterns, languages, and question types
* Daily system design challenges
* Curated learning roadmaps (Backend, Frontend, DevOps, System Design)
* Personalized recommendations and "suggest next" feature
* Hidden gems and expert picks discovery

### 🔹 Taxonomy & Navigation

* Browse by categories, subcategories, and tags
* Filter by language, difficulty level, and question type
* Architecture pattern exploration (Microservices, etc.)
* Breadcrumb-based navigation

---

## ⚙️ API Overview

The API is organized into 16 route modules with **100+ endpoints**. Below is a categorized summary.

### 🔐 Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register a new user | - |
| POST | `/api/v1/auth/login` | Login and receive JWT | - |
| POST | `/api/v1/auth/logout` | Logout and invalidate token | - |
| POST | `/api/v1/auth/refresh-token` | Refresh access token | - |
| GET | `/api/v1/auth/profile` | Get current user profile | ✅ |
| PATCH | `/api/v1/auth/profile` | Update profile | ✅ |
| DELETE | `/api/v1/auth/profile` | Delete account | ✅ |
| POST | `/api/v1/auth/forgot-password` | Request password reset | - |
| POST | `/api/v1/auth/reset-password` | Reset password with token | - |
| POST | `/api/v1/auth/verify-email` | Verify email address | - |

### 📌 Concepts (`/api/v1/concepts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/concepts` | List all concepts (paginated) |
| GET | `/api/v1/concepts/random` | Get a random concept |
| GET | `/api/v1/concepts/latest` | Get latest concepts |
| GET | `/api/v1/concepts/trending` | Get trending concepts |
| GET | `/api/v1/concepts/popular` | Get popular concepts |
| GET | `/api/v1/concepts/:id` | Get a single concept |
| GET | `/api/v1/concepts/:id/summary` | Get concept summary |
| GET | `/api/v1/concepts/:id/history` | Get concept history |
| GET | `/api/v1/concepts/:id/related` | Get related concepts |
| POST | `/api/v1/concepts` | Create a new concept |
| PUT | `/api/v1/concepts/:id` | Update a concept |
| PATCH | `/api/v1/concepts/:id` | Partially update a concept |
| PATCH | `/api/v1/concepts/:id/archive` | Archive a concept |
| PATCH | `/api/v1/concepts/:id/restore` | Restore an archived concept |
| DELETE | `/api/v1/concepts/:id` | Delete a concept |

### 🔍 Search (`/api/v1/search`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/search` | General search |
| GET | `/api/v1/search/title` | Search by title/prompt |
| GET | `/api/v1/search/content` | Search by response content |
| GET | `/api/v1/search/tags` | Search by tags |
| GET | `/api/v1/search/patterns` | Search by architecture pattern |
| GET | `/api/v1/search/language` | Search by language |
| GET | `/api/v1/search/category` | Search by category |
| GET | `/api/v1/search/difficulty` | Search by difficulty level |
| GET | `/api/v1/search/fuzzy` | Fuzzy text search |
| GET | `/api/v1/search/autocomplete` | Autocomplete suggestions |
| GET | `/api/v1/search/recent` | Recent searches |
| GET | `/api/v1/search/popular` | Popular search terms |
| GET | `/api/v1/search/exact` | Exact match search |
| GET | `/api/v1/search/regex` | Regex pattern search |

### 🏷️ Filter (`/api/v1/filter`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/filter/category` | Filter by category |
| GET | `/api/v1/filter/difficulty` | Filter by difficulty |
| GET | `/api/v1/filter/pattern` | Filter by architecture pattern |
| GET | `/api/v1/filter/language` | Filter by language |
| GET | `/api/v1/filter/date` | Filter by date range |
| GET | `/api/v1/filter/tags` | Filter by tags |
| GET | `/api/v1/filter/bookmarks` | Most bookmarked |
| GET | `/api/v1/filter/trending` | Trending filters |
| GET | `/api/v1/filter/popular` | Popular filters |
| GET | `/api/v1/filter/unexplored` | Least explored topics |
| GET | `/api/v1/filter/expert-only` | Advanced topics only |
| GET | `/api/v1/filter/frontend` | Frontend topics |
| GET | `/api/v1/filter/backend` | Backend topics |
| GET | `/api/v1/filter/devops` | DevOps topics |
| GET | `/api/v1/filter/cloud` | Cloud topics |

### 📊 Analytics (`/api/v1/analytics`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/analytics/total-concepts` | Total concept count |
| GET | `/api/v1/analytics/category-distribution` | Category distribution |
| GET | `/api/v1/analytics/difficulty-stats` | Difficulty level stats |
| GET | `/api/v1/analytics/patterns/top` | Top architecture patterns |
| GET | `/api/v1/analytics/languages/top` | Top languages |
| GET | `/api/v1/analytics/views/top` | Most viewed concepts |
| GET | `/api/v1/analytics/bookmarks/top` | Most bookmarked concepts |
| GET | `/api/v1/analytics/trending` | Trending analytics |
| GET | `/api/v1/analytics/growth` | Growth trends |
| GET | `/api/v1/analytics/searches/top` | Top searches |
| GET | `/api/v1/analytics/searches/failed` | Failed searches |
| GET | `/api/v1/analytics/engagement` | User engagement stats |
| GET | `/api/v1/analytics/api-performance` | API performance metrics |
| GET | `/api/v1/analytics/database-performance` | DB performance metrics |
| GET | `/api/v1/analytics/cache-hit-rate` | Cache hit rate |

### 🌐 Taxonomy (`/api/v1`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories` | List all categories |
| GET | `/api/v1/categories/:category` | Get category details |
| GET | `/api/v1/categories/:category/concepts` | Concepts in a category |
| GET | `/api/v1/subcategories` | List all subcategories |
| GET | `/api/v1/tags` | List all tags |
| GET | `/api/v1/tags/:tag` | Get concepts by tag |
| GET | `/api/v1/patterns` | List architecture patterns |
| GET | `/api/v1/patterns/:patternName` | Get pattern details |
| GET | `/api/v1/languages` | List all languages |
| GET | `/api/v1/languages/:language` | Concepts by language |
| GET | `/api/v1/difficulty` | List difficulty levels |
| GET | `/api/v1/difficulty/:level` | Concepts by difficulty |
| GET | `/api/v1/question-types` | List question types |
| GET | `/api/v1/question-types/:type` | Concepts by question type |

### 🔭 Discovery (`/api/v1/discovery`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/discovery/roadmap/backend` | Backend learning roadmap |
| GET | `/api/v1/discovery/roadmap/frontend` | Frontend learning roadmap |
| GET | `/api/v1/discovery/roadmap/devops` | DevOps learning roadmap |
| GET | `/api/v1/discovery/roadmap/system-design` | System design roadmap |
| GET | `/api/v1/discovery/suggest-next/:id` | Suggest next concept |
| GET | `/api/v1/discovery/recommended/:userId` | Personalized recommendations |
| GET | `/api/v1/discovery/trending` | Trending discoveries |
| GET | `/api/v1/discovery/hidden-gems` | Underrated concepts |
| GET | `/api/v1/discovery/expert-picks` | Expert-curated picks |
| GET | `/api/v1/discovery/daily-challenge` | Daily system design challenge |

### 🔖 Bookmarks, Notes & Votes (`/api/v1`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/bookmarks/:conceptId` | Bookmark a concept | ✅ |
| DELETE | `/api/v1/bookmarks/:conceptId` | Remove bookmark | ✅ |
| GET | `/api/v1/bookmarks` | Get all bookmarks | ✅ |
| POST | `/api/v1/notes/:conceptId` | Add note to concept | ✅ |
| GET | `/api/v1/notes/:conceptId` | Get notes for concept | ✅ |
| PATCH | `/api/v1/notes/:noteId` | Update a note | ✅ |
| DELETE | `/api/v1/notes/:noteId` | Delete a note | ✅ |
| POST | `/api/v1/votes/:conceptId` | Vote on a concept | ✅ |
| GET | `/api/v1/votes/top` | Top voted concepts | - |

### 🛡️ Admin (`/api/v1/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/users` | List all users |
| GET | `/api/v1/admin/users/:id` | Get user details |
| PATCH | `/api/v1/admin/users/:id/role` | Change user role |
| PATCH | `/api/v1/admin/users/:id/ban` | Ban a user |
| PATCH | `/api/v1/admin/users/:id/unban` | Unban a user |
| GET | `/api/v1/admin/logs` | View system logs |
| GET | `/api/v1/admin/system/health` | System health check |
| GET | `/api/v1/admin/system/logs` | System logs |
| DELETE | `/api/v1/admin/cache/clear` | Clear cache |
| POST | `/api/v1/admin/system/maintenance` | Toggle maintenance mode |

### 🔧 System (`/api/v1`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/system/status` | System status |
| GET | `/api/v1/system/version` | API version |
| GET | `/api/v1/system/config` | System configuration |
| GET | `/api/v1/system/uptime` | Server uptime |
| GET | `/api/v1/system/cache/status` | Cache status |
| GET | `/api/v1/system/storage/status` | Storage status |
| GET | `/api/v1/system/database/status` | Database status |
| POST | `/api/v1/system/reindex` | Reindex database |
| POST | `/api/v1/system/restart` | Restart server |

### 📋 Additional Endpoints

* `POST /api/v1/concepts/bulk/create` - Bulk create concepts
* `PATCH /api/v1/concepts/bulk/update` - Bulk update concepts
* `DELETE /api/v1/concepts/bulk/delete` - Bulk delete concepts
* `PATCH /api/v1/concepts/bulk/archive` - Bulk archive concepts
* `PATCH /api/v1/concepts/bulk/restore` - Bulk restore concepts
* `GET /api/v1/concepts/scroll` - Cursor-based pagination
* `GET /api/v1/concepts/infinite` - Infinite scroll pagination
* `POST /api/v1/validate/concept` - Validate concept data
* `POST /api/v1/validate/search` - Validate search query
* `POST /api/v1/validate/tags` - Validate tags
* `GET /api/v1/middleware/logger` - Test logger middleware
* `GET /api/v1/middleware/auth` - Test auth middleware
* `GET /api/v1/middleware/rate-limit` - Test rate limiter

> 📘 **Full API documentation with request/response examples is available on Postman:** [https://documenter.getpostman.com/view/50840766/2sBXwmQYQA](https://documenter.getpostman.com/view/50840766/2sBXwmQYQA)

---

## 🛠️ Tech Stack

### 🔧 Backend

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js 5** | Web framework & routing |
| **MongoDB** | NoSQL database |
| **Mongoose 9** | ODM for MongoDB |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **cors** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |
| **nodemon** | Development auto-restart |

### 🎨 Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **Vite 8** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Material UI 9** | Component library |
| **Redux Toolkit** | State management |
| **React Router 7** | Client-side routing |
| **Axios** | HTTP client with JWT interceptor |
| **Formik + Yup** | Form handling & validation |
| **React Hot Toast** | Toast notifications |
| **React Icons** | Icon library |
| **React Helmet Async** | SEO & document head management |

---

## 📂 Project Structure

```
caia_system_design_mann_patel/
│
├── backend/
│   ├── src/
│   │   ├── app.js                    # Express app setup, route mounting
│   │   ├── server.js                 # Entry point, DB connection, server start
│   │   ├── config/
│   │   │   └── db.config.js          # Mongoose connection config
│   │   ├── controllers/              # 16 controller files
│   │   │   ├── admin.controller.js
│   │   │   ├── analytics.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── bookmark.controller.js
│   │   │   ├── bulkOperations.controller.js
│   │   │   ├── discovery.controller.js
│   │   │   ├── errorHandling.controller.js
│   │   │   ├── filter.controller.js
│   │   │   ├── pagination.controller.js
│   │   │   ├── prompt.controller.js
│   │   │   ├── protected.controller.js
│   │   │   ├── search.controller.js
│   │   │   ├── sort.controller.js
│   │   │   ├── system.controller.js
│   │   │   ├── taxonomy.controller.js
│   │   │   └── validation.controller.js
│   │   ├── middlewares/               # 6 middleware files
│   │   │   ├── auth.middleware.js
│   │   │   ├── admin.middleware.js
│   │   │   ├── cache.middleware.js
│   │   │   ├── compression.middleware.js
│   │   │   ├── logger.middleware.js
│   │   │   └── rateLimit.middleware.js
│   │   ├── models/                   # 2 Mongoose models
│   │   │   ├── prompt.model.js
│   │   │   └── user.model.js
│   │   ├── routes/                   # 16 route files
│   │   │   ├── admin.routes.js
│   │   │   ├── analytics.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── bookmark.routes.js
│   │   │   ├── bulkOperations.routes.js
│   │   │   ├── discovery.routes.js
│   │   │   ├── errorHandling.routes.js
│   │   │   ├── filter.routes.js
│   │   │   ├── pagination.routes.js
│   │   │   ├── prompt.routes.js
│   │   │   ├── protected.routes.js
│   │   │   ├── search.routes.js
│   │   │   ├── sort.routes.js
│   │   │   ├── system.routes.js
│   │   │   ├── taxonomy.routes.js
│   │   │   └── validation.routes.js
│   │   └── scripts/                  # Seed scripts
│   │       ├── seedMicroservices.js
│   │       ├── seedLanguageDifficulty.js
│   │       └── seedBookmarks.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── main.jsx                  # React entry point
│   │   ├── App.jsx                   # Root component & providers
│   │   ├── app/
│   │   │   └── store.js             # Redux store configuration
│   │   ├── components/               # 28 reusable components
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── loaders/
│   │   │   └── ui/
│   │   ├── constants/
│   │   │   └── index.js
│   │   ├── contexts/
│   │   │   └── ThemeContext.jsx
│   │   ├── features/                 # Redux slices
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   └── concepts/
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/                    # 21 page components
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   └── user/
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   └── services/
│   │       ├── api.js
│   │       └── dashboardService.js
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

* **Node.js** (v18 or higher)
* **MongoDB** (local or Atlas connection string)
* **npm** or **yarn**

### 1️⃣ Clone Repository

```bash
git clone https://github.com/mann2007-ptl/caia_system_design_mann_patel.git
cd caia_system_design_mann_patel
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Run the backend server:

```bash
npm run dev    # Development with nodemon
# or
npm start      # Production
```

The API will be available at `http://localhost:3000`.

### 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000
```

Run the frontend dev server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 4️⃣ Seed the Database (Optional)

```bash
cd backend
node src/scripts/seedMicroservices.js
node src/scripts/seedLanguageDifficulty.js
node src/scripts/seedBookmarks.js
```

---

## 📥 Data Import Strategy

* **Bulk insertion** using `insertMany()` for efficient loading
* JSON dataset parsing and transformation to match the schema
* Metadata mapping to structured fields (category, difficulty, language)
* Seed scripts for Microservices concepts, language/difficulty assignment, and bookmarks
* Idempotent seed operations (safe to run multiple times)

---

## 🧪 Testing

* API testing via **Postman** with comprehensive collection
* Full API documentation with examples on Postman
* CRUD validation for all concept operations
* Search & filter testing across multiple dimensions
* Authentication flow testing (register, login, token refresh, password reset)
* Error handling verification for all edge cases
* Middleware testing (auth, admin, rate limit, logger, cache)

---

## 📈 Performance Optimizations

* **Indexed fields** on `prompt`, `category`, `difficulty`, `language`, `question_type` for fast queries
* **Pagination** with offset, cursor-based, and infinite scroll support for large datasets
* **Optimized MongoDB queries** with projection and selective field retrieval
* **Efficient filtering logic** using compound queries
* **Rate limiting** middleware to prevent abuse
* **Caching middleware** for frequently accessed data
* **Response compression** for reduced bandwidth

---

## ⚠️ Challenges Faced

* Mapping complex nested JSON dataset to a normalized MongoDB schema
* Designing a scalable API structure with 16 modular route modules
* Implementing efficient search queries across multiple fields (fuzzy, regex, autocomplete)
* Handling nested metadata filtering with compound queries
* Building a role-based access control system with JWT
* Managing state complexity with Redux for both user and admin dashboards
* Seamless integration of Tailwind CSS 4 with Material UI 9 components

---

## 🚀 Deployment

### Frontend (Vercel)

The frontend is deployed on **Vercel** at:
[https://caia-system-design.vercel.app](https://caia-system-design.vercel.app)

### Backend (Render)

The backend API is deployed on **Render** at:
[https://caia-system-design-mann-patel.onrender.com/](https://caia-system-design-mann-patel.onrender.com/)

---

## 🔮 Future Improvements

* AI-based summarization of system design responses
* Voice search for hands-free concept discovery
* Graph-based concept visualization and relationship mapping
* Recommendation engine using user behavior and preferences
* Export concepts as PDF or markdown files
* Collaborative notes and shared bookmarks
* Gamification with streaks, badges, and leaderboards

---

## 🤝 Contribution

This project is part of an academic assignment. External contributions are not open.

---

## 📜 License

Educational use only.

---

## 👨‍💻 Author

**Mann Patel**
* GitHub: [https://github.com/mann2007-ptl](https://github.com/mann2007-ptl)
* Project Repository: [https://github.com/mann2007-ptl/caia_system_design_mann_patel](https://github.com/mann2007-ptl/caia_system_design_mann_patel)

---

## ⭐ Acknowledgment

This project is developed as part of the **CGxSU Full Stack Assignment** to demonstrate real-world system design, backend architecture, and full-stack development skills.

Special thanks to the course instructors and the open-source community for providing the tools and libraries that made this project possible.
