// src/database/models/Beat.js
const mongoose = require('mongoose');

const BeatSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  bpm: { type: Number, required: true },
  key: { type: String, required: true },
  productUrl: { type: String, required: true },
  beatFile: { type: String, required: true },  // Path to beat file
  coverImage: { type: String, required: true }, // Path to cover image
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Beat', BeatSchema);

// src/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('src/uploads'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dest = file.fieldname === 'beat' ? 'src/uploads/beats' : 'src/uploads/covers';
    cb(null, dest);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Beat = require('./database/models/Beat');

// Routes
// Upload new beat
app.post('/api/beats', upload.fields([
  { name: 'beat', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const beatData = {
      title: req.body.title,
      description: req.body.description,
      bpm: req.body.bpm,
      key: req.body.key,
      productUrl: req.body.productUrl,
      beatFile: req.files['beat'][0].path,
      coverImage: req.files['cover'][0].path
    };
    
    const beat = new Beat(beatData);
    await beat.save();
    
    res.json(beat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all beats
app.get('/api/beats', async (req, res) => {
  try {
    const beats = await Beat.find().sort({ createdAt: -1 });
    res.json(beats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update beat
app.put('/api/beats/:id', upload.fields([
  { name: 'beat', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const beatData = {
      title: req.body.title,
      description: req.body.description,
      bpm: req.body.bpm,
      key: req.body.key,
      productUrl: req.body.productUrl
    };
    
    if (req.files['beat']) {
      beatData.beatFile = req.files['beat'][0].path;
    }
    if (req.files['cover']) {
      beatData.coverImage = req.files['cover'][0].path;
    }
    
    const beat = await Beat.findByIdAndUpdate(req.params.id, beatData, { new: true });
    res.json(beat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete beat
app.delete('/api/beats/:id', async (req, res) => {
  try {
    await Beat.findByIdAndDelete(req.params.id);
    res.json({ message: 'Beat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});