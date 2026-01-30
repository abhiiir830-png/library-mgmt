const express = require('express');
const router = express.Router();
const {
  requestIssue,
  getMyIssues,
  getPendingIssues,
  approveIssue,
  rejectIssue,
  returnBook,
  renewBook,
} = require('../controllers/issueController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// POST /api/issues/request - Request book issue (Student/Faculty)
router.post('/request', auth, role('student', 'faculty'), requestIssue);

// GET /api/issues - Get user's own issues (Student/Faculty)
router.get('/', auth, role('student', 'faculty'), getMyIssues);

// GET /api/issues/pending - Get all pending issues (Librarian only)
router.get('/pending', auth, role('librarian'), getPendingIssues);

// PUT /api/issues/:id/approve - Approve issue (Librarian only)
router.put('/:id/approve', auth, role('librarian'), approveIssue);

// PUT /api/issues/:id/reject - Reject issue (Librarian only)
router.put('/:id/reject', auth, role('librarian'), rejectIssue);

// PUT /api/issues/:id/return - Return book (Student/Faculty/Librarian)
router.put('/:id/return', auth, returnBook);

// PUT /api/issues/:id/renew - Renew book (Faculty only)
router.put('/:id/renew', auth, role('faculty'), renewBook);

module.exports = router;
