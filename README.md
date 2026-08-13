<div align="center">

# 💸 EvenUp

### A full-stack expense-splitting app with AI-powered categorization and automatic debt simplification

Built with the MERN stack — split bills the smart way, not the messy way.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev)

[Live Demo](#) · [Video Walkthrough](https://www.loom.com/share/93f53623cf324b78ac46ff77dead38e0) · [Report a Bug](#)

</div>

---

## 📖 About

**EvenUp** solves a problem every roommate, travel group, and couple runs into eventually: shared expenses get messy fast. Someone pays for dinner, someone else covers the Uber, and by the end of the week nobody remembers who owes who what.

EvenUp keeps one shared ledger per group, calculates every balance automatically, and — instead of showing a tangled web of individual debts — runs a **debt-simplification algorithm** that reduces everything down to the fewest possible payments needed to settle up.

It also uses **Google Gemini AI** to read an expense's description and automatically suggest a category, so categorizing spending doesn't require manual effort every single time.

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based auth with httpOnly cookies, bcrypt password hashing, strong password policy with a live strength checklist, and a full forgot/reset password flow
- 👥 **Groups & Friends** — create shared expense groups, add members via a friend-picker or email, manage roles (group admin vs. member)
- 💰 **Flexible Expense Splitting** — split any expense **Equally**, by **Exact** amounts, by **Percentage**, or by **Shares**
- 🤖 **AI-Powered Categorization** — Google Gemini reads the expense description and suggests a category automatically (Food, Rent, Transport, etc.)
- 🧮 **Debt Simplification Algorithm** — a greedy matching algorithm that reduces a group's tangled debts into the minimum number of payments required to settle everyone
- ✅ **Settle Up** — record real-world payments (cash/online) and watch balances update instantly across every member
- 🔁 **Recurring Expenses** — mark an expense as Daily/Weekly/Monthly and a scheduled background job (cron) automatically re-creates it on time
- 📊 **Activity Feed & Spending Insights** — a combined expense/settlement timeline, plus a category breakdown chart
- 📄 **PDF Export** — download a full expense/settlement ledger for any group
- 🛡️ **Admin Dashboard** — platform-wide analytics (users, groups, expenses, settlements, growth chart), full user/group/expense/settlement management
- 📱 **Fully Responsive** — mobile-first design with a dedicated bottom nav on small screens
- 📧 **Email Notifications** — automatic emails when an expense is added or a debt is settled
- ⚡ **Real-Time-ish Sync** — background polling keeps every open session up to date without manual refreshing

---

## 🖼️ Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Group Balance & Debt Simplification
![Group Detail](./screenshots/group-detail.png)

### AI-Powered Expense Categorization
![Add Expense](./screenshots/add-expense.png)

### Flexible Splitting
![Split Types](./screenshots/split-types.png)

### Admin Dashboard
![Admin Dashboard](./screenshots/admin-dashboard.png)

### Responsive Design
![Mobile View](./screenshots/mobile-view.png)

### Insights
![Insights](./screenshots/insights.png)

### Signup
![Signup](./screenshots/signup.png)

### Login
![Login](./screenshots/login.png)

---

## 🧠 The Debt Simplification Algorithm

This is the core technical highlight of the project. Instead of tracking every individual expense's debt separately, EvenUp:

1. Calculates each person's **net balance** in a group (money they're owed minus money they owe)
2. Splits everyone into **creditors** (owed money) and **debtors** (owe money), sorted largest first
3. Greedily matches the biggest debtor with the biggest creditor, settles as much as possible between them, and repeats
4. Produces the **minimum number of transactions** needed to zero out every balance in the group

```
Example — 3 people, tangled debts:
  Ali is owed Rs 900
  Sara is owed Rs 300
  You owe Rs 1200

Without simplification: could be 3+ separate payments
With simplification:
  You pay Ali Rs 900
  You pay Sara Rs 300
  → Just 2 clean transactions, everyone settled
```

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS v4
- TanStack Query (server state, caching, auto-refetch)
- Zustand (auth state)
- React Hook Form + Zod (form validation)
- Framer Motion (animations)
- Recharts (charts)
- Axios

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (access + refresh tokens) + bcrypt
- Google Gemini AI (`@google/genai`)
- Cloudinary (image uploads)
- Nodemailer (email notifications)
- node-cron (scheduled recurring expenses)
- PDFKit (ledger export)
- express-validator, express-rate-limit, Helmet

---

## 🏗️ Architecture

```
Client (React)  ⇄  REST API (Express)  ⇄  MongoDB
                          ↓
              Google Gemini AI · Cloudinary · Gmail SMTP
```

The backend follows a layered architecture:

```
Routes → Controllers → Services → Models
```

- **Routes** map URLs to controller functions — no logic here
- **Controllers** handle the request/response cycle — no business logic here
- **Services** contain the actual business rules (balance calculations, the debt-simplification algorithm, split logic) — this is the "brain"
- **Models** define the exact shape of data stored in MongoDB

This separation keeps the money-critical logic (balance math) isolated in one place, tested and trusted, rather than scattered across the codebase.

---

## 📂 Project Structure

```
evenup/
├── server/
│   └── src/
│       ├── config/          # DB, env, Cloudinary, mailer, cron setup
│       ├── models/           # User, Group, Expense, Split, Settlement, Friendship
│       ├── controllers/      # Request/response handlers
│       ├── services/         # Business logic (balances, splits, debt algorithm)
│       ├── routes/           # API route definitions
│       ├── middlewares/      # Auth, admin, error handling, validation
│       ├── utils/            # AppError, apiResponse, asyncHandler, logger
│       └── validators/       # express-validator rule sets
│
└── client/
    └── src/
        ├── components/
        │   ├── ui/            # Button, Input, Modal, Avatar, Badge, Card...
        │   ├── layout/        # Navbar, Sidebar, MobileNav, DashboardLayout
        │   ├── group/         # Group-specific components
        │   ├── expense/       # Expense-specific components
        │   ├── dashboard/     # Balance cards, activity feed, charts
        │   └── admin/         # Admin panel components
        ├── features/          # TanStack Query hooks, organized by domain
        ├── pages/              # Route-level page components
        ├── routes/             # Route definitions + guards
        ├── lib/                # axios instance, toast config, query client
        └── hooks/ & utils/     # Reusable helpers
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Google Gemini API key](https://aistudio.google.com/apikey)
- A [Cloudinary](https://cloudinary.com) account (free tier)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) for sending emails

### 1. Clone the repository
```bash
git clone https://github.com/your-username/evenup.git
cd evenup
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-flash-latest

EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

---

## 🔐 Roles & Permissions

EvenUp has two independent role systems:

| Role | Scope | How you get it |
|---|---|---|
| **Group Admin** | One specific group | Automatically, by creating that group |
| **Site Admin** | The entire platform | Manually set in the database — a deliberate security choice, since a public "become admin" button would be a serious vulnerability |

| Action | Group Admin | Group Member |
|---|---|---|
| Add/edit own expenses | ✅ | ✅ |
| Edit/delete others' expenses | ✅ | ❌ |
| Add/remove members | ✅ | ❌ |
| Delete the group | ✅ | ❌ |

---

## 🧪 API Overview

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/forgot-password
PATCH  /api/v1/auth/reset-password/:token

GET    /api/v1/groups
POST   /api/v1/groups
GET    /api/v1/groups/:id/balances
GET    /api/v1/groups/:id/simplified-debts

POST   /api/v1/expenses
PATCH  /api/v1/expenses/:id
DELETE /api/v1/expenses/:id
GET    /api/v1/expenses/suggest-category

POST   /api/v1/settlements/group/:groupId

GET    /api/v1/admin/stats
GET    /api/v1/admin/users
GET    /api/v1/admin/expenses
GET    /api/v1/admin/settlements
```

---

## 🎥 Demo

📺 [Watch the full video walkthrough](#)

A ~2 minute walkthrough covering group creation, AI-assisted expense splitting across all four split types, live debt simplification, and the admin dashboard.

---

## 🗺️ Known Limitations / Roadmap

- No real payment gateway integration (Stripe/JazzCash) — "Settle Up" is intentionally a record-keeping action, not a real money transfer, matching how Splitwise's core product works
- No WebSocket-based real-time sync — currently uses background polling (every 5-8s)
- Multi-payer expenses are supported in the data model but not yet exposed in the UI
- No email verification enforcement yet

---

## 👤 Author

**Eman Nazir**
MERN Stack Developer · [LinkedIn](https://www.linkedin.com/in/eman-nazir-231145316/) · [GitHub](ithub.com/Eman-Nazir)

Built as part of a full-stack development challenge, focused on writing production-quality, well-tested business logic rather than just CRUD — with particular attention to correctness in the balance/debt calculations, since financial math has zero tolerance for silent bugs.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

<div align="center">

If you found this project interesting, consider giving it a ⭐

</div>
