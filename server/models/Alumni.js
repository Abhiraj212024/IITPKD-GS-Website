const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subsystem: { type: String, required: true },
  currentEmployer: String, // Specific to Alumni
  position: { type: String, required: true },
  email: { type: String, required: true },
  linkedin: String,
  instagram: String,
  photo: String
});

// Mongoose will look for the "alumni" collection
module.exports = mongoose.model('Alumni', alumniSchema);