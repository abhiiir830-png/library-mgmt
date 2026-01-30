const express = require('express');
const router = express.Router();
const {
  getOverdueBooks,
  getAnalytics,
} = require('../controllers/reportController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// GET /api/reports/overdue - Get overdue books (Librarian/Admin)
router.get('/overdue', auth, role('librarian', 'admin'), getOverdueBooks);

// GET /api/reports/analytics - Get system analytics (Admin only)
router.get('/analytics', auth, role('admin'), getAnalytics);

module.exports = router;
