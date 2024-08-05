const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle routes for profile pages
app.get('/profile/:username', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/profile/index.html'));
});

// Handle routes for testimony pages
app.get('/testimony/:username', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/testimony/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
