const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: String,
  to: String,
  message: String,
  time: String
})

module.exports = mongoose.model('Message', messageSchema);
