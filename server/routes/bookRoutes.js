const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// GET /api/books - Get all books (public, with search/filter)
router.get('/', getBooks);

// GET /api/books/:id - Get single book (public)
router.get('/:id', getBook);

// POST /api/books - Create book (Admin only)
router.post('/', auth, role('admin'), createBook);

// PUT /api/books/:id - Update book (Admin only)
router.put('/:id', auth, role('admin'), updateBook);

// DELETE /api/books/:id - Delete book (Admin only)
router.delete('/:id', auth, role('admin'), deleteBook);

module.exports = router;
