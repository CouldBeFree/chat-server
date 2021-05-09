const User = require('../models/User');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get psychologists
// @route   PUT /api/v1/psychologists
// @access  Public
exports.getPsychologists = asyncHandler(async (req, res) => {
  const users = await User.find({ userType: 'psychologist' });

  res.status(200).json({
    success: true,
    data: users
  })
});
