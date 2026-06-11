# 🚀 DecodeLabs Internship 2026 — Project 1: The Skin

> **Epic Multi-Page Frontend Portfolio with Live Backend Integration**

A production-grade, multi-page frontend application that connects to a real REST API backend. Features 3D particle animations, real-time data dashboards, interactive API playgrounds, and a modern dark UI that recruiters actually remember.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-6366f1?style=for-the-badge&logo=githubpages)](https://ahmedabbas52233-a11y.github.io/Internship-Project-1/)
[![Backend](https://img.shields.io/badge/Backend%20API-Project%202--4-06b6d4?style=for-the-badge&logo=nodedotjs)](https://github.com/ahmedabbas52233-a11y/Internship-Project-2)
[![Tests](https://img.shields.io/badge/Tests-36%20Passing-22c55e?style=for-the-badge&logo=jest)](https://github.com/ahmedabbas52233-a11y/Internship-Project-2)

---

## ✨ What's Different (Why This Is "Epic")

| Feature | Standard Portfolio | This Portfolio |
|---------|-------------------|----------------|
| **Pages** | Single page | **4 pages** (Home, Projects, Playground, Contact) |
| **Animations** | Basic CSS fade | **3D particle system** with mouse-reactive physics |
| **Backend** | Static/mock data | **Live API integration** — real MongoDB data |
| **Dashboard** | None | **Real-time metrics** auto-refreshing every 30s |
| **API Testing** | None | **Interactive playground** — test endpoints live |
| **Design** | Generic template | **Custom dark UI** with glassmorphism, gradients, noise |
| **Code Quality** | Inline everything | **Modular CSS/JS** — production-grade architecture |

---

## 🎨 Visual Design System

### 3D Particle Background
- **60 interactive particles** with connection lines
- **Mouse-reactive physics** — particles repel from cursor
- **Velocity damping** for organic movement
- **Canvas 2D** — zero dependencies, maximum performance

### UI Components
| Component | Tech |
|-----------|------|
| Glassmorphism Nav | `backdrop-filter: blur(24px)` |
| Gradient Typography | `background-clip: text` with multi-color gradients |
| Animated Orb (Hero) | CSS concentric rings with `rotate` animation |
| Noise Texture | SVG filter overlay at 3% opacity |
| Scroll Reveal | Intersection Observer API |
| Toast Notifications | Fixed position with slide-up animation |

### Color Palette
```
--bg-primary:    #0a0a0f  (Deep space black)
--bg-secondary:  #111118  (Card background)
--accent-primary: #6366f1 (Indigo)
--accent-secondary: #8b5cf6 (Violet)
--accent-tertiary: #ec4899 (Pink)
--text-primary:  #f1f5f9  (Off-white)
--text-secondary:#94a3b8  (Slate)
```

---

## 🔗 Backend Integration

This frontend is the **entry point** to a full-stack application:

| Project | Repository | Role |
|---------|-----------|------|
| **Project 1** | [Internship-Project-1](https://github.com/ahmedabbas52233-a11y/Internship-Project-1) | ⬅️ **You are here** — Frontend Skin |
| **Project 2** | [Internship-Project-2](https://github.com/ahmedabbas52233-a11y/Internship-Project-2) | REST API — The Nervous System |
| **Project 3** | [Internship-Project-2](https://github.com/ahmedabbas52233-a11y/Internship-Project-2) | MongoDB Integration — The Memory |
| **Project 4** | [Internship-Project-2](https://github.com/ahmedabbas52233-a11y/Internship-Project-2) | JWT Authentication — The Vault |

### API Endpoints Used

| Endpoint | Method | Purpose | Page |
|----------|--------|---------|------|
| `/api/health` | GET | Check API & database status | All pages (nav indicator) |
| `/api/contact` | POST | Submit contact form to MongoDB | Playground, Contact |
| `/api/users` | POST | Create user with bcrypt hash | Playground |
| `/api/users` | GET | Fetch user count for dashboard | Playground |
| `/api/posts` | GET | Fetch post count for dashboard | Playground |

---

## 📁 File Structure

```
Internship-Project-1/
├── index.html              # Home page — Hero + Featured projects
├── projects.html           # All projects with architecture diagram
├── playground.html         # Live API testing + Dashboard
├── contact.html            # Contact info + Message form
├── css/
│   └── style.css           # Complete design system (25KB)
├── js/
│   └── main.js             # Particle system, API service, UI (15KB)
├── assets/
│   └── (images if needed)
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- The backend API running locally or deployed

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ahmedabbas52233-a11y/Internship-Project-1.git
   cd Internship-Project-1
   ```

2. **Update the API URL** in `js/main.js`:
   ```javascript
   const CONFIG = {
       API_BASE_URL: 'http://localhost:3000/api', // Local dev
       // API_BASE_URL: 'https://your-backend.onrender.com/api', // Production
   };
   ```

3. **Start the backend** (from Project 2 repo):
   ```bash
   cd ../Internship-Project-2
   npm install
   npm run dev
   ```

4. **Open any HTML file** in your browser or use Live Server.

### Deploy to GitHub Pages

1. Go to **Settings → Pages** in your repo
2. Select **Deploy from a branch** → `main` → `/ (root)`
3. Your site will be live at `https://ahmedabbas52233-a11y.github.io/Internship-Project-1/`

---

## 🎯 What Recruiters See

| What They Look For | What You Show |
|-------------------|---------------|
| "Can they build real UIs?" | Custom design system, 3D particles, glassmorphism |
| "Do they know APIs?" | Live fetch calls, error handling, status codes, JSON parsing |
| "Can they connect frontend to backend?" | Real MongoDB data flowing into dashboard |
| "Do they understand deployment?" | GitHub Pages + Render integration |
| "Is this production-ready?" | Loading states, toast notifications, responsive design, accessibility |
| "Can they write clean code?" | Modular architecture, ES6 classes, separation of concerns |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Structure** | Semantic HTML5 |
| **Styling** | CSS3 Custom Properties, Grid, Flexbox, backdrop-filter |
| **Animations** | Canvas 2D API, CSS Keyframes, Intersection Observer |
| **Backend** | Node.js, Express, MongoDB, Mongoose, JWT |
| **Integration** | Fetch API, CORS |
| **Testing** | Jest, Supertest, mongodb-memory-server |
| **Deployment** | GitHub Pages (Frontend), Render (Backend) |

---

## 📸 Pages Preview

### Home (`index.html`)
- Animated hero with gradient text
- 3D orb visual
- Featured project cards with hover effects
- Live API status indicator

### Projects (`projects.html`)
- All 4 projects with detailed descriptions
- Technology tags
- Architecture diagram showing frontend ↔ backend flow
- GitHub links

### API Playground (`playground.html`)
- **Live Dashboard** — Real-time user/post/contact counts
- **Contact Form** — Submits to MongoDB, shows JSON response
- **User Creator** — Creates users with bcrypt hashing
- **Health Check** — Tests API connectivity
- Auto-refreshing metrics

### Contact (`contact.html`)
- Social links (GitHub, LinkedIn, Email)
- Quick message form connected to live API
- Responsive two-column layout

---

## 📝 License

MIT © Ahmed Abbas

---

> Built with passion during **DecodeLabs Internship 2026** 🚀
