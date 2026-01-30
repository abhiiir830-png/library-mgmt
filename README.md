# Academic Library Book Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing library books, users, and book issues in an academic setting.

## 🎯 Project Overview

This system provides role-based access control for different user types:
- **Students**: Can browse books, request issues, and return books
- **Faculty**: Can browse books, request issues, renew books, and return books
- **Librarians**: Can approve/reject book issue requests and view reports
- **Admins**: Full system access including user management, book management, and analytics

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool

## 📁 Project Structure

```
CURSSS/
├── server/                 # Backend code
│   ├── config/
│   │   └── db.js          # Database connection
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── issueController.js
│   │   ├── userController.js
│   │   └── reportController.js
│   ├── middleware/        # Custom middleware
│   │   ├── auth.js        # JWT authentication
│   │   └── role.js        # Role-based access control
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Issue.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── issueRoutes.js
│   │   ├── userRoutes.js
│   │   └── reportRoutes.js
│   ├── scripts/
│   │   └── seed.js       # Database seeding script
│   ├── server.js         # Entry point
│   ├── package.json
│   └── .env             # Environment variables
│
└── client/              # Frontend code
    ├── src/
    │   ├── components/  # Reusable components
    │   │   ├── Header.jsx
    │   │   ├── Loading.jsx
    │   │   └── DashboardRedirect.jsx
    │   ├── context/     # React context
    │   │   └── AuthContext.jsx
    │   ├── pages/       # Page components
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── BookList.jsx
    │   │   ├── StudentDashboard.jsx
    │   │   ├── FacultyDashboard.jsx
    │   │   ├── LibrarianDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── UserManagement.jsx
    │   │   ├── Reports.jsx
    │   │   └── AddEditBook.jsx
    │   ├── utils/       # Utility functions
    │   │   ├── api.js   # Axios instance
    │   │   └── toast.js # Toast notifications
    │   ├── App.jsx      # Main app component
    │   └── main.jsx     # Entry point
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CURSSS
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `server` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your-secret-key-change-in-production
   ```

   For MongoDB Atlas, your connection string will look like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database_name
   ```

5. **Seed the database** (Optional but recommended)
   ```bash
   cd server
   npm run seed
   ```

   This will create sample users and books:
   - **Admin**: admin@library.com / admin123
   - **Librarian**: librarian@library.com / librarian123
   - **Student**: student@library.com / student123
   - **Faculty**: faculty@library.com / faculty123

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books (with search/filter)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)

### Issues
- `POST /api/issues/request` - Request book issue (Student/Faculty)
- `GET /api/issues` - Get user's issues (Student/Faculty)
- `GET /api/issues/pending` - Get pending issues (Librarian)
- `PUT /api/issues/:id/approve` - Approve issue (Librarian)
- `PUT /api/issues/:id/reject` - Reject issue (Librarian)
- `PUT /api/issues/:id/return` - Return book
- `PUT /api/issues/:id/renew` - Renew book (Faculty only)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Reports
- `GET /api/reports/overdue` - Get overdue books (Librarian/Admin)
- `GET /api/reports/analytics` - Get system analytics (Admin only)

## 👥 User Roles & Permissions

### Student
- Browse and search books
- Request book issues
- View issued books
- Return books
- Loan period: 14 days

### Faculty
- All student permissions
- Renew books (extends due date by 30 days)
- Loan period: 30 days

### Librarian
- View pending issue requests
- Approve/reject book issue requests
- View overdue books
- View reports

### Admin
- All permissions
- Manage books (CRUD operations)
- Manage users (view, edit, delete, assign roles)
- View system analytics
- View all reports

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. After login, the token is stored in localStorage and automatically included in API requests.

## 📝 Features

- ✅ User authentication and authorization
- ✅ Role-based access control
- ✅ Book management (CRUD)
- ✅ Book issue/return system
- ✅ Book renewal (Faculty)
- ✅ Search and filter books
- ✅ Overdue book tracking
- ✅ System analytics and reports
- ✅ User management (Admin)
- ✅ Responsive UI

## 🧪 Testing the Application

1. **Login as Admin**
   - Email: `admin@library.com`
   - Password: `admin123`
   - Can manage books, users, and view reports

2. **Login as Librarian**
   - Email: `librarian@library.com`
   - Password: `librarian123`
   - Can approve/reject book requests and view overdue books

3. **Login as Student**
   - Email: `student@library.com`
   - Password: `student123`
   - Can browse books, request issues, and return books

4. **Login as Faculty**
   - Email: `faculty@library.com`
   - Password: `faculty123`
   - Can browse books, request issues, renew books, and return books

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (if using local installation)
- Check your MongoDB Atlas connection string
- Verify network access in MongoDB Atlas (IP whitelist)

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using the port

### CORS Issues
- Ensure backend CORS is configured to allow frontend origin
- Check that both servers are running

### Authentication Issues
- Clear localStorage and try logging in again
- Check that JWT_SECRET is set in `.env`

## 📦 Production Build

### Build Frontend
```bash
cd client
npm run build
```

### Run Production Server
```bash
cd server
npm start
```

## 🤝 Contributing

This is a final year project. For improvements or bug fixes, please create an issue or submit a pull request.

## 📄 License

This project is for academic purposes.

## 👨‍💻 Author

Created as a final year project for academic evaluation.

---

**Note**: This is a demonstration project. For production use, implement additional security measures, input validation, error handling, and testing.
