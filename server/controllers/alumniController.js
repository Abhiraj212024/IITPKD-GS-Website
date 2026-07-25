const Alumni = require('../models/Alumni');

const getAllAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find();
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllAlumni = getAllAlumni;
