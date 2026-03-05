# 🚀 TaskFlow AI — Intelligent Task Manager

A full-stack AI-powered task management application built with React, Node.js, Express, and MongoDB. Features AI task generation, smart breakdowns, Kanban boards, analytics, and beautiful animations.

## ✨ Features

- **🤖 AI Studio** — Generate full task plans from a goal description using Claude AI
- **🔬 Task Breakdown** — AI decomposes complex tasks into actionable subtasks
- **📋 Daily AI Planner** — Smart daily prioritization based on your tasks
- **🎯 Kanban Board** — Drag-and-drop task management across 4 columns
- **📊 Analytics** — Charts for productivity, status, priority, and category breakdown
- **🔐 Auth** — JWT-based authentication (register/login)
- **⚡ Animations** — Smooth Framer Motion transitions throughout

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Framer Motion, Recharts |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT + bcryptjs |
| AI | Anthropic Claude API (claude-sonnet) |
| Deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas |

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Anthropic API key (for AI features)

### 1. Clone & Setup

```bash
git clone <your-repo>
cd ai-task-manager
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

**Server `.env`:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-task-manager
JWT_SECRET=your_super_secret_key_minimum_32_chars
CLIENT_URL=http://localhost:5173
ANTHROPIC_API_KEY=sk-ant-...  # Optional - AI features require this
```

> **Note on AI:** The AI routes call the Anthropic API. The API key needs to be handled on the backend. You have two options:
> 1. Add `ANTHROPIC_API_KEY` env var and modify `server/routes/ai.js` to use it in headers
> 2. Use the frontend-direct approach (already set up — no server key needed if frontend has access)

### 3. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
# Edit .env
npm run dev
```

**Client `.env`:**
```
VITE_API_URL=http://localhost:5000/api
```

Open http://localhost:5173

---

## 🌐 Free Deployment Guide

### Step 1: MongoDB Atlas (Free)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Create database user (username + password)
4. Allow network access from anywhere (0.0.0.0/0)
5. Copy connection string: `mongodb+srv://user:pass@cluster.mongodb.net/ai-task-manager`

### Step 2: Deploy Backend on Render (Free)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
5. Add Environment Variables:
   ```
   MONGODB_URI = <your atlas connection string>
   JWT_SECRET = <random 32+ char string>
   CLIENT_URL = <your vercel URL - add after deploying frontend>
   NODE_ENV = production
   ```
6. Deploy! Note your service URL: `https://your-app.onrender.com`

### Step 3: Deploy Frontend on Vercel (Free)
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Settings:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
4. Add Environment Variables:
   ```
   VITE_API_URL = https://your-app.onrender.com/api
   ```
5. Deploy! Note your URL: `https://your-app.vercel.app`

### Step 4: Update CORS
Go back to Render → Environment Variables → Update:
```
CLIENT_URL = https://your-app.vercel.app
```

### Step 5: AI Features Setup
The AI routes in the backend call the Anthropic API. To enable:

1. Update `server/routes/ai.js` - add the API key header:
```javascript
headers: {
  'Content-Type': 'application/json',
  'x-api-key': process.env.ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01'
}
```

2. Add to Render environment:
```
ANTHROPIC_API_KEY = sk-ant-your-key-here
```

---

## 📁 Project Structure

```
ai-task-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Layout.jsx  # Sidebar + navigation
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── pages/          # Route pages
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Board.jsx   # Kanban
│   │   │   ├── TaskList.jsx
│   │   │   ├── AIStudio.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Settings.jsx
│   │   ├── context/        # React Context (Auth + Tasks)
│   │   └── utils/          # API service layer
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── ai.js
│   ├── middleware/
│   │   └── auth.js         # JWT middleware
│   └── index.js
└── README.md
```

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PATCH | `/api/auth/profile` | Update profile |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (with filters) |
| GET | `/api/tasks/stats` | Get task statistics |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| DELETE | `/api/tasks/bulk/completed` | Delete all done |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/breakdown` | Break task into subtasks |
| POST | `/api/ai/generate` | Generate tasks from goal |
| POST | `/api/ai/daily-plan` | Get AI daily plan |

---

## 🎨 Design System

- **Font:** Syne (display) + DM Sans (body)
- **Theme:** Dark with indigo/teal/pink accents
- **Animations:** Framer Motion with spring physics
- **CSS:** Custom properties + utility classes

---

Built with ❤️ for portfolio showcase. MIT License.
