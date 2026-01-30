const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// All routes are Admin only
router.get('/', auth, role('admin'), getUsers);
router.get('/:id', auth, role('admin'), getUser);
router.put('/:id', auth, role('admin'), updateUser);
router.delete('/:id', auth, role('admin'), deleteUser);

module.exports = router;
