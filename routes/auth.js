const express = require('express');
const {
  register,
  login,
  getMe,
  resetPassword,
  updateDetails,
  updatePassword,
  logout
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/update-password', protect, updatePassword);
router.put('/reset-password/:resettoken', resetPassword);

module.exports = router;
