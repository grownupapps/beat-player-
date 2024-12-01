const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test-Route
app.get('/', (req, res) => {
  res.send('<h1>Hallo! Der Beat-Player ist online! 🎵</h1>');
});

// API Test-Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API ist funktionsfähig!' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});

module.exports = app;