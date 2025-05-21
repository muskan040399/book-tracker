const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

// Import books routes
const bookRoutes = require('./routes/books');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use /books route
app.use('/books', bookRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
