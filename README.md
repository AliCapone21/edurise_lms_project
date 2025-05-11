# 🧠 EduRise LMS - Backend

The backend of the EduRise platform, powering API logic, user roles, payments, and educator management.

---

## 🔥 Features

- Role-based authentication using **Clerk**
- User metadata sync with **MongoDB**
- Stripe integration for payments
- Webhooks: Clerk + Stripe
- File uploads using Multer (images + video)
- Educator course management endpoints
- Admin approval for new educators

---

## 🧑‍💻 API Overview

### 🧑‍🏫 Educator Routes

| Route | Description |
|-------|-------------|
| `GET /api/educator/requests` | List all pending educator requests *(admin only)* |
| `POST /api/educator/approve/:userId` | Approve/Reject educator *(admin only)* |
| `GET /api/educator/courses` | Get courses created by educator |
| `POST /api/educator/add-course` | Add a new course with chapters, lectures |
| `GET /api/educator/dashboard` | Dashboard overview for educators |

### 👨‍🎓 Student Routes

| Route | Description |
|-------|-------------|
| `GET /api/course/all` | Get all published courses |
| `GET /api/user/enrolled-courses` | Fetch enrolled courses for student |

### 🔐 Webhooks

- `POST /api/webhook/clerk` — sync user on login/update/delete
- `POST /api/webhook/stripe` — track payment intent + update enrollment

---

## 🧪 Test With Postman

Use bearer tokens via Clerk for protected endpoints.

**Example:**

```http
GET /api/educator/requests
Authorization: Bearer <Clerk JWT Token>
```

---

## ⚙️ Setup Instructions

1. Clone the repo
```bash
git clone https://github.com/yourusername/edurise-backend.git
cd edurise-backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file

```
PORT=5000
MONGODB_URI=your_mongodb_connection
CLERK_SECRET_KEY=your_clerk_secret
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

4. Run the backend server
```bash
npm run start
```

---

## 🧰 Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Clerk (Auth)
- Stripe (Payments)
- Multer (Uploads)
- Svix (Clerk Webhooks)

---

## 👥 Author

Built with ❤️ by [Your Name]