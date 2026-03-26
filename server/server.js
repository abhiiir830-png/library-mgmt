const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
); // CORS config driven by FRONTEND_URL
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Get port from environment or default
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


