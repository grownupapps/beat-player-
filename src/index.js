const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Hallo! Der Beat-Player ist online! 🎵</h1>');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});