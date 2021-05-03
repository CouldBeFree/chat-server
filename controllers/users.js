const User = require('../models/User');
const Message = require('../models/Message');
const asyncHandler = require('../middleware/async');

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  let files = null;

  if (req.files && req.files['thumb']) files = req.files['thumb']

  if(files && files.length) {
    req.body.photo = files[0].path
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  })
});

// @desc    Update user
// @route   GET /api/v1/users
// @access  Private
exports.getUsers = asyncHandler(async (req, res) => {
  const user = await User.find({ userType: req.query.user } )

  res.status(200).json({
    success: true,
    data: user
  })
});

// @desc    Get messages
// @route   GET /api/v1/users/message
// @access  Private
exports.getMessages = asyncHandler(async(req, res) => {
  const messages = await Message.find( {
    $or: [
      { from: { $eq: req.query.user }, to: { $eq: req.user.name } },
      { from: { $eq: req.user.name }, to: { $eq: req.query.user } }
    ]
  })
    .sort({time: 'ascending'})

  res.status(200).json({
    success: true,
    data: messages
  })
})
