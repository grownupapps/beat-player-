const express = require('express');
const multer = require('multer');
const path = require('path');
const Beat = require('../database/models/Beat');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = file.fieldname === 'beat' ? 'uploads/beats' : 'uploads/covers';
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/beats', async (req, res) => {
  try {
    const beats = await Beat.find().sort({ createdAt: -1 });
    res.json(beats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/beats', upload.fields([
  { name: 'beat', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const beatData = {
      ...req.body,
      beatFile: req.files.beat[0].path,
      coverImage: req.files.cover[0].path
    };
    
    const beat = new Beat(beatData);
    await beat.save();
    res.status(201).json(beat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/beats/:id', upload.fields([
  { name: 'beat', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const beat = await Beat.findById(req.params.id);
    if (!beat) {
      return res.status(404).json({ message: 'Beat not found' });
    }

    const updateData = { ...req.body };
    if (req.files.beat) {
      updateData.beatFile = req.files.beat[0].path;
    }
    if (req.files.cover) {
      updateData.coverImage = req.files.cover[0].path;
    }

    const updatedBeat = await Beat.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedBeat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/beats/:id', async (req, res) => {
  try {
    await Beat.findByIdAndDelete(req.params.id);
    res.json({ message: 'Beat deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;