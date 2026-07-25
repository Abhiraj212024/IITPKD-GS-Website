const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  Name: String,
  Subsystem: String,
  "Hierarchical Position": String,
  Email: String,
  "LinkedIN ID": String,
  "Instagram ID": String,
  Photo: String,
  "Current Education/Job ": String,
  "Batch and Branch": String,
  Timestamp: String,
}, { strict: false });

// Mongoose will look for the "alumni" collection specifically
module.exports = mongoose.model('Alumni', alumniSchema, 'alumni');