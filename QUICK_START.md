# Quick Start Guide

## 🚀 Fast Setup (5 minutes)

### Step 1: Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Step 2: Configure Environment

Create `server/.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your-secret-key-change-in-production
```

**For MongoDB Atlas:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Replace `<password>` with your password
5. Add your IP to whitelist

### Step 3: Seed Database (Optional but Recommended)

```bash
cd server
npm run seed
```

This creates test accounts:
- **Admin**: admin@library.com / admin123
- **Librarian**: librarian@library.com / librarian123
- **Student**: student@library.com / student123
- **Faculty**: faculty@library.com / faculty123

### Step 4: Start Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Step 5: Open Browser

Navigate to: `http://localhost:5173`

## ✅ Test the Application

1. **Login as Admin** → Manage books, users, view reports
2. **Login as Librarian** → Approve/reject book requests
3. **Login as Student** → Browse and request books
4. **Login as Faculty** → Browse, request, and renew books

## 📋 Demo Checklist

- [ ] Register a new user
- [ ] Login with different roles
- [ ] Browse and search books
- [ ] Request a book issue (as Student/Faculty)
- [ ] Approve a request (as Librarian)
- [ ] Return a book
- [ ] Renew a book (as Faculty)
- [ ] Add/edit/delete books (as Admin)
- [ ] Manage users (as Admin)
- [ ] View reports and analytics (as Admin)

## 🐛 Common Issues

**MongoDB Connection Failed**
- Check your MONGO_URI in `.env`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify username/password are correct

**Port Already in Use**
- Change PORT in `.env` to another number (e.g., 5001)
- Or kill the process: `lsof -ti:5000 | xargs kill`

**CORS Errors**
- Ensure backend is running on port 5000
- Check that frontend API base URL matches backend

**Cannot Login**
- Clear browser localStorage
- Check that seed script ran successfully
- Verify email/password are correct

## 📞 Need Help?

Check the main [README.md](README.md) for detailed documentation.
