# Library Management System - Implementation Plan

## 📋 Project Overview
Academic Library Book Management System with 4 roles: Student, Faculty, Librarian, Admin

---

## 🎯 PHASE 1: Backend Foundation (Core Setup)
**Goal**: Get authentication and basic schemas working

### Backend Tasks:
1. ✅ Update User model (add roles: student, faculty, librarian, admin)
2. ⬜ Create Book model (with all required fields)
3. ⬜ Create Issue model (with status: Pending, Issued, Returned, Overdue)
4. ⬜ Install dependencies: bcryptjs, jsonwebtoken
5. ⬜ Create auth middleware (verify JWT tokens)
6. ⬜ Create role middleware (check user roles)
7. ⬜ Implement POST /api/auth/register
8. ⬜ Implement POST /api/auth/login
9. ⬜ Test with Postman/Thunder Client

**Deliverable**: Users can register/login, get JWT token

---

## 🎯 PHASE 2: Books Management (Backend + Basic Frontend)
**Goal**: Admin can manage books, all users can view/search

### Backend Tasks:
1. ⬜ Implement GET /api/books (with search/filter)
2. ⬜ Implement POST /api/books (Admin only)
3. ⬜ Implement PUT /api/books/:id (Admin only)
4. ⬜ Implement DELETE /api/books/:id (Admin only)

### Frontend Tasks:
1. ⬜ Create Login page
2. ⬜ Create Register page
3. ⬜ Create Book List/Search page (public)
4. ⬜ Create Add/Edit Book page (Admin)
5. ⬜ Create Auth context (store user token/role)
6. ⬜ Create protected routes

**Deliverable**: Admin dashboard for managing books, users can browse

---

## 🎯 PHASE 3: Issue/Return System (Core Feature)
**Goal**: Students/Faculty can request books, Librarian approves

### Backend Tasks:
1. ⬜ Implement POST /api/issues/request (create issue request)
2. ⬜ Implement GET /api/issues (get user's issues)
3. ⬜ Implement GET /api/issues/pending (Librarian: all pending requests)
4. ⬜ Implement PUT /api/issues/:id/approve (Librarian: approve request)
5. ⬜ Implement PUT /api/issues/:id/reject (Librarian: reject request)
6. ⬜ Implement PUT /api/issues/:id/return (return book)
7. ⬜ Implement PUT /api/issues/:id/renew (Faculty: renew book)
8. ⬜ Auto-update book availability when issue is approved/returned

### Frontend Tasks:
1. ⬜ Create Student Dashboard (view books, request issue, view issued books)
2. ⬜ Create Faculty Dashboard (same + renew option)
3. ⬜ Create Librarian Dashboard (pending requests, approve/reject, return books)
4. ⬜ Create Issue History page

**Deliverable**: Complete issue/return workflow working

---

## 🎯 PHASE 4: Admin & Reports
**Goal**: Admin manages users, view reports

### Backend Tasks:
1. ⬜ Implement GET /api/users (Admin: list all users)
2. ⬜ Implement PUT /api/users/:id (Admin: update user role)
3. ⬜ Implement DELETE /api/users/:id (Admin: delete user)
4. ⬜ Implement GET /api/reports/overdue (Librarian/Admin: overdue books)
5. ⬜ Implement GET /api/reports/analytics (Admin: system stats)

### Frontend Tasks:
1. ⬜ Create Admin Dashboard (user management, assign roles)
2. ⬜ Create Reports page (overdue books, analytics)
3. ⬜ Create User Management page

**Deliverable**: Full admin functionality

---

## 🎯 PHASE 5: Polish & Demo Prep
**Goal**: Make it demo-ready

### Tasks:
1. ⬜ Create seed script (sample books, users)
2. ⬜ Add navigation/header component
3. ⬜ Add loading states
4. ⬜ Add error handling (toast notifications)
5. ⬜ Add basic styling (make it presentable)
6. ⬜ Test all workflows end-to-end
7. ⬜ Create README with setup instructions

**Deliverable**: Project ready for demo/evaluation

---

## 📦 Required Dependencies

### Server (to install):
```bash
cd server
npm install bcryptjs jsonwebtoken
```

### Client (to install):
```bash
cd client
npm install axios  # for API calls
```

---

## 📁 Recommended Folder Structure

### Server:
```
server/
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   ├── Book.js
│   └── Issue.js
├── routes/
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   ├── issueRoutes.js
│   ├── userRoutes.js
│   └── reportRoutes.js
├── middleware/
│   ├── auth.js (verify JWT)
│   └── role.js (check role permissions)
├── controllers/
│   ├── authController.js
│   ├── bookController.js
│   ├── issueController.js
│   ├── userController.js
│   └── reportController.js
├── server.js
└── .env
```

### Client:
```
client/src/
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── BookList.jsx
│   ├── StudentDashboard.jsx
│   ├── FacultyDashboard.jsx
│   ├── LibrarianDashboard.jsx
│   ├── AdminDashboard.jsx
│   └── Reports.jsx
├── components/
│   ├── Header.jsx
│   ├── BookCard.jsx
│   └── IssueCard.jsx
├── context/
│   └── AuthContext.jsx
├── utils/
│   └── api.js (axios instance)
├── App.jsx
└── main.jsx
```

---

## 🔄 Enhanced API Endpoints

### Auth:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me (get current user - optional)

### Books:
- GET /api/books (with query: ?search=, ?category=)
- GET /api/books/:id
- POST /api/books (Admin only)
- PUT /api/books/:id (Admin only)
- DELETE /api/books/:id (Admin only)

### Issues:
- POST /api/issues/request
- GET /api/issues (current user's issues)
- GET /api/issues/pending (Librarian: all pending)
- PUT /api/issues/:id/approve (Librarian)
- PUT /api/issues/:id/reject (Librarian)
- PUT /api/issues/:id/return
- PUT /api/issues/:id/renew (Faculty only)

### Users (Admin only):
- GET /api/users
- GET /api/users/:id
- PUT /api/users/:id (update role)
- DELETE /api/users/:id

### Reports:
- GET /api/reports/overdue (Librarian/Admin)
- GET /api/reports/analytics (Admin)

---

## ✅ Implementation Strategy

1. **Start with Phase 1** - Get authentication working first
2. **Test each phase** before moving to next
3. **Build incrementally** - don't skip phases
4. **Use simple UI** - focus on functionality over design
5. **Keep code clean** - easy to understand for evaluators
6. **Document as you go** - comments in code

---

## 🚀 Quick Start Checklist (After Implementation)

1. Create `.env` in server with MONGO_URI
2. Run `npm install` in both server and client
3. Start MongoDB (locally or MongoDB Atlas)
4. Run seed script to populate data
5. Start server: `npm run dev` (add nodemon script)
6. Start client: `npm run dev`
7. Test all roles and workflows

---

## 💡 Tips for Final Year Project Demo

1. **Prepare test accounts** for each role (student, faculty, librarian, admin)
2. **Have sample data ready** (20-30 books in different categories)
3. **Practice the demo flow** beforehand
4. **Explain the architecture** (MERN stack, JWT auth, role-based access)
5. **Show error handling** (what happens if book unavailable, etc.)
6. **Be ready to explain** your code choices

---

**Estimated Time**: 2-3 weeks if done phase by phase
**Priority**: Phase 1-3 are critical, Phase 4-5 are for polish

