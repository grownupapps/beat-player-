const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Beat Player ist online auf Render!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});