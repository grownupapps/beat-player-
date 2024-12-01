const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet()); // Sicherheits-Headers
app.use(compression()); // Komprimierung
app.use(cors()); // Cross-Origin Requests erlauben
app.use(express.json()); // Body-Parser für JSON
app.use(express.urlencoded({ extended: true }));

// Statische Dateien servieren
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Konfiguration für File-Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = file.fieldname === 'beat' 
      ? 'uploads/beats' 
      : 'uploads/covers';
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Datenbank-Verbindung
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beat-player', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB verbunden'))
.catch(err => console.error('MongoDB Verbindungsfehler:', err));

// Routes importieren
const adminRoutes = require('./admin/adminRoutes');
const playerRoutes = require('./public-player/playerRoutes');

// Routes verwenden
app.use('/api/admin', adminRoutes);
app.use('/api/player', playerRoutes);

// Basis-Route
app.get('/', (req, res) => {
  res.send('<h1>Hallo! Der Beat-Player ist online! 🎵</h1>');
});

// Production Setup
if (process.env.NODE_ENV === 'production') {
  // Statische Dateien vom React-Build servieren
  app.use(express.static('client/build'));

  // Alle unbekannten Routes zum React Frontend
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Etwas ist schief gelaufen!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});

module.exports = app;