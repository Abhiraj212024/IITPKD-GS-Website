const mongoose = require('mongoose');

// Define the schema
const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subsystem: {
    type: String,
    required: true,
    enum: ['Propulsion', 'Avionics', 'Ground Station', 'Recovery', 'Payload', 'Airframe'],
    description: "Member's Subsystem"
  },
  currentEmployer: {
    type: String,
    required: false,
    trim: true,
    description: "Current employer of the alumni"
  },
  position: {
    type: String,
    required: true,
    enum: ['Member', 'Apprentice', 'Mentor', 'Subsystem Lead'],
    description: "Position in team hierarchy"
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  linkedin: {
    type: String,
    required: false,
    trim: true,
    description: "LinkedIn profile URL"
  },
  instagram: {
    type: String,
    required: false,
    trim: true,
    description: "Instagram handle"
  },
  photo: {
    type: String,
    required: false,
    description: "Google Drive link to photo"
  }
});

// Create the model
const Member = mongoose.model('Member', memberSchema);

module.exports = Member;