# SkillForge — Peer-to-Peer Student Skill Exchange & Knowledge Forge

<p align="center">
  <strong>Forge Your Skills. Master Your Craft. Grow Together.</strong>
</p>

<p align="center">
  <a href="https://skillforge.onrender.com"><strong>🚀 Visit Live Application</strong></a>
  &nbsp; | &nbsp;
  <a href="https://github.com/Dhruv-Nikam/SkillForge"><strong>📂 GitHub Repository</strong></a>
</p>

<p align="center">
  <strong>Crafted with ❤️ by <a href="https://github.com/Dhruv-Nikam">Dhruv</a></strong> — Full-Stack MERN Developer
</p>

---

## 📌 About the Project

**SkillForge** is an accessible, community-driven skill exchange platform designed to make peer-to-peer learning collaborative, rewarding, and completely free.

Every student has something they can teach and something they want to learn. One student might be proficient in Python and Data Science but want to learn UI/UX design, while another might know React and Figma and want to improve their backend programming skills. SkillForge connects these students so they can learn from each other through a mutually beneficial exchange.

Instead of paying for expensive courses or learning in isolation, students can discover peers with complementary skills, exchange learning requests, arrange structured sessions, communicate through real-time chat, and earn verified badges and community reviews.

The platform is built around a simple idea:

> **Everyone has a skill worth sharing, and everyone has something new to forge.**

SkillForge is a free-to-use platform with no subscriptions or paywalls. It encourages hands-on collaboration, mentorship, and practical knowledge sharing among students.

### 🌐 Live Demo

**Try SkillForge here:** https://skillforge.onrender.com

The application is deployed on Render as a unified service with MongoDB Atlas storage.

---

## ✨ Features

### 👤 Authentication and Profiles
- Student registration, login, and secure logout.
- Secure authentication using JWT-based tokens stored in HTTP-only cookies (`skillforge_token`).
- Profile creation and editing with full bio, college, and availability schedule.
- Multi-skill teaching lists, learning goals, and proficiency levels (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`).
- Public student profiles to explore peer expertise.

### 🏆 Gamification & Achievement Badges
- **Tiered Badge System**:
  - **Skill Novice** (Bronze / Emerald): Awarded upon sharing first skills in the community.
  - **Code Mentor** (Silver / Cyan): Awarded to active mentors sharing 3+ distinct disciplines.
  - **Master Swapper** (Gold / Violet): Awarded to prolific collaborators with multiple completed swaps or 5+ skills.
  - **Top Rated Mentor** (Gold): Awarded to mentors maintaining an exceptional 4.5+ star rating from peers.
  - **Curious Explorer** (Bronze / Blue): Awarded to learners with 3+ active goals or open to any skill.
  - **Forge Pioneer** (Silver / Teal): Founding member recognition for complete profile holders.
- **Visual Badge Integration**: Badges are displayed dynamically on header user avatars, discovery cards, and dedicated profile showcase panels with level progress indicators.

### 🔍 Discovery, Matching & Quick Search Filters
- Browse and search for students based on name, skills, or college.
- **Quick Category Filters**: Fast filter pills for **Technology**, **Design**, **Creative**, **Languages**, **Music**, **Communication**, and **Academic**.
- **Availability Status Filtering**: Filter peers by their study schedule (Weekdays, Weekends, Flexible 3+ days).
- **Reciprocal Skill Matching**: Sophisticated matching algorithm calculating complementary skill-match scores (0–100) based on mutual teaching/learning compatibility.
- Minimum rating filters (1+ to 4+ stars).

### 🤝 Skill Exchange Requests
- Send structured exchange requests to other students specifying both the desired skill and the skill offered in return.
- Recipient can accept or decline requests.
- Track incoming and outgoing requests with clear lifecycle statuses.

### 📅 Learning Session Management
- Propose scheduled learning sessions with title, description, start time, and duration.
- Automated timezone conversion to the viewer's local timezone.
- Strict confirmation and completion controls (sessions can only be marked complete after their scheduled end).

### 💬 Real-Time Messaging
- Private chat between accepted exchange partners powered by Socket.IO.
- Real-time unread message counters in the navigation header.
- Typing indicators and persisted conversation history.

### ⭐ Verified Reviews & Reputation
- Students who complete a scheduled session can leave star ratings (1–5) and constructive feedback.
- Aggregate reputation score and review counts displayed publicly to foster trust.

---

## 🎨 UI/UX Design & Theme

- **Modern Emerald & Cyan Theme**:
  - Primary Accent: Rich Emerald Green (`#059669` / `#10b981`)
  - Secondary Accent: Cyan & Electric Teal (`#06b6d4` / `#0891b2`)
  - Subtle glowing gradients, modern glassmorphism, and responsive card layouts.
- **Light & Dark Mode**: Seamless toggle between clean crisp light paper and dark obsidian themes (`data-theme="dark"`), persisted in `localStorage`.
- **Responsive Layout**: Tailored for mobile screens, tablets, and desktop workstations.

---

## 🛠️ Technology Stack

### Frontend (`client/`)
- **React 19**
- **Vite 8**
- **React Router 7**
- **Socket.IO Client 4**
- **Custom Modern Emerald / Cyan CSS Design System**

### Backend (`server/`)
- **Node.js** (v20+)
- **Express 5**
- **MongoDB & Mongoose 8**
- **Socket.IO 4** (WebSockets)
- **JSON Web Tokens (JWT) & bcryptjs**
- **Zod 4** (Strict input validation)

---

## 🚀 Getting Started

Follow these instructions to run SkillForge locally.

### Prerequisites

- **Node.js:** Version 20.19+ or 22.12+, compatible with Vite 8.
- **npm:** Version 10+ (included with Node.js).
- **MongoDB:** A local MongoDB instance or MongoDB Atlas cluster.
- **Git:** To clone the repository.

### 1. Clone the Repository

```bash
git clone https://github.com/dhruv/SkillForge.git
cd SkillForge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Environment

Create a `server/.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/skillforge
JWT_SECRET=your-secure-jwt-secret-with-at-least-32-characters
CLIENT_URL=http://localhost:5173
```

### 4. Seed Demo Data (Optional)

Follow the instructions in [`DEMO_DATA.md`](./DEMO_DATA.md) to seed sample student profiles:

```powershell
$env:NODE_ENV = 'development'
$env:DEMO_SEED_CONFIRM = 'CREATE_DEMO_DATA'
$env:DEMO_SEED_PASSWORD = 'your-secure-password'
npm run seed:demo --workspace server -- --apply
```

### 5. Start Development Servers

Run both the client and server concurrently:

```bash
# Terminal 1: Client
npm run dev:client

# Terminal 2: Server
npm run dev:server
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Testing & Code Quality

SkillForge includes a suite of unit, integration, and security tests:

```bash
# Run all checks (lint, build, and tests)
npm run check

# Run server test suite only
npm test --workspace server

# Run client linter
npm run lint --workspace client

# Run client production build
npm run build --workspace client
```

---

## 👤 Author

**Dhruv**  
- GitHub: [@dhruv](https://github.com/dhruv)  
- Role: Full-Stack MERN Developer & Maintainer

---

## 📄 License

MIT License — see LICENSE for details.

<p align="center">
  <strong>SkillForge — Forge Your Skills. Master Your Craft. Grow Together.</strong>
</p>
