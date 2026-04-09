const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subsystem: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true },
  linkedin: String,
  instagram: String,
  photo: String
});

// Mongoose will look for the "members" collection
module.exports = mongoose.model('Member', memberSchema);