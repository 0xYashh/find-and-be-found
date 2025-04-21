const express = require('express');
const cors = require('cors');
const path = require('path');
const submitProfile = require('./routes/submitProfile');
const search = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/profiles', submitProfile);
app.use('/api/search', search);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 