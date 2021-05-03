const express = require('express');
const {
  updateUser,
  getUsers,
  getMessages
} = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.put('/:id', protect, updateUser)
router.get('/', protect, getUsers)
router.get('/messages', protect, getMessages)

module.exports = router;
