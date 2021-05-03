const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  education: String,
  contacts: String,
  approaches: String,
  workWith: String,
  aboutMe: String,
  userType: {
    type: String,
    required: [true, 'User type is required'],
    enum: [
      "psychologist",
      "user"
    ]
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: 6,
    select: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  photo: {
    type: String
  }
});

// Encrypt password
userSchema.pre('save', async function (next) {

  const salt = await bcrypt.genSalt(10);

  // Re-assign hashed version over original, plain text password
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function(){
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(password){
  return await bcrypt.compare(password, this.password);
};

// Generate and reset password token
userSchema.methods.getResetPasswordToken = async function(){
  // Generate token
  const resetToken = crypto.randomBytes(20).toLocaleString('hex');

  // Hash token  and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
