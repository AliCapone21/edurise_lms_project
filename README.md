# 🎓 EduRise LMS – Fullstack Learning Management System

EduRise is a modern, full-featured Learning Management System (LMS) built with a scalable and modular architecture. It supports **students**, **educators**, and **administrators** through a seamless web interface powered by **React.js**, **Node.js**, **MongoDB**, **Clerk**, and **Stripe**.

---

## 🔗 Live Deployment

- **Frontend**: [edurise-lms-project.vercel.app](https://edurise-lms-project.vercel.app)
- **Backend**: [edurise-backend.onrender.com](https://edurise-backend.onrender.com)

---

## 📦 Project Structure

```
edurise_lms_project/
├── client/         # Frontend (React + Clerk + Tailwind)
├── server/         # Backend (Node.js + Express + MongoDB)
├── render.yaml     # Render deployment config
└── README.md       # Root README (this file)
```

---

## ⚙️ Tech Stack Overview

| Layer       | Technology                       |
|-------------|----------------------------------|
| Frontend    | React.js (Vite), Tailwind CSS    |
| Backend     | Node.js, Express.js              |
| Database    | MongoDB with Mongoose            |
| Auth        | Clerk.dev (OAuth + JWT)          |
| Payments    | Stripe                           |
| Rich Text   | Quill.js                         |
| Deployment  | Vercel (Frontend), Render (API)  |

---

## 🚀 Features

### 👨‍🎓 Students
- Register/login securely using Clerk
- Browse, preview, and enroll in courses
- Watch lectures and track progress
- AI-assisted course search when no match is found

### 🧑‍🏫 Educators
- Request educator role
- After approval: create courses, chapters, lectures
- Manage enrollments and track student views
- Upload multimedia and set pricing via Stripe

### 🛡️ Admins
- Manage educator requests
- Access platform-level statistics
- Oversee user activity and maintain quality

---

## 🧪 Development Setup

### 1. Clone the Repo
```bash
git clone https://github.com/AliCapone21/edurise_lms_project.git
cd edurise_lms_project
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 3. Backend Setup
```bash
cd ../server
npm install
npm run start
```

> 🔐 Configure both projects with proper `.env` variables as documented in their respective README files.

---

## 📁 Environment Variables

**Frontend (`client/.env`):**
```
VITE_BACKEND_URL=https://edurise-backend.onrender.com
VITE_CURRENCY=$
```

**Backend (`server/.env`):**
```
PORT=5000
MONGODB_URI=<your-mongo-uri>
CLERK_SECRET_KEY=<your-clerk-secret>
CLERK_WEBHOOK_SECRET=<your-clerk-webhook-secret>
STRIPE_SECRET_KEY=<your-stripe-secret>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
```

---

## 📌 Notes

- All educator actions are **role-gated** and must be approved by the admin.
- Webhooks from Clerk and Stripe are validated and used for syncing metadata and payment statuses.
- The project uses **JWT** middleware and role-based guards for API access.

---

## 📘 Documentation

- Frontend details in [`client/README.md`](./client/README.md)
- Backend details in [`server/README.md`](./server/README.md)

---

## 👨‍💻 Author

Built with ❤️ by **Ali Farhodov**