# 🎓 EduRise LMS - Frontend

EduRise is a full-featured Learning Management System (LMS) allowing **students**, **educators**, and **admins** to interact through a modern and responsive frontend built with **React.js**.

## 🌐 Live Demo

> Coming soon...

---

## 🚀 Features

### 👩‍🎓 Students
- Browse and enroll in courses
- Stream lectures using an interactive video player
- Track enrollments & progress
- Contact support

### 🧑‍🏫 Educators
- Request to become an educator
- Create and manage courses
- Add chapters, lectures, thumbnails, and preview videos
- Track earnings and student enrollments

### 🔐 Admins
- View & manage pending educator requests
- Approve or reject educators via Admin Panel
- Secure access based on user roles

---

## 🔑 Role-based Navigation

| Role | Features |
|------|----------|
| Student | Enroll in courses, track progress |
| Educator | Course management dashboard |
| Admin | Access admin panel and approve educators |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── educator/
│   ├── student/
├── context/
│   └── AppContext.js
├── pages/
│   ├── educator/
│   ├── student/
│   └── admin/
├── App.jsx
└── main.jsx
```

---

## ⚙️ Setup Instructions

1. Clone the repo
```bash
git clone https://github.com/yourusername/edurise-frontend.git
cd edurise-frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure `.env`

```
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=$
```

4. Run the development server
```bash
npm run dev
```

---

## 🧪 Tech Stack

- React.js (Vite)
- TailwindCSS
- Axios
- Clerk Auth
- React Router
- React Toastify
- Stripe (for payments)
- Quill.js (Rich Text Editor)

---

## 📌 Notes

- **Educators** must be approved by **Admin** to access dashboard.
- Clerk role metadata is synced with MongoDB on login.
- Protected routes and conditionally rendered components are based on roles.

---

## 👥 Author

Built by [Your Name]