const express = require('express');
const router = express.Router();
const pool = require('../db');  // PostgreSQL pool
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads folder if not exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// GET all books
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST new book with optional image
router.post('/', upload.single('cover'), async (req, res) => {
  const { title, author, genre, status } = req.body;
  const cover = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      'INSERT INTO books (title, author, genre, status, cover) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, author, genre, status, cover]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ✅ FIXED: Use router.put instead of app.put
/*router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, status } = req.body;

  try {
    const result = await pool.query(
      'UPDATE books SET title = $1, author = $2, genre = $3, status = $4 WHERE id = $5 RETURNING *',
      [title, author, genre, status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/


router.put('/:id', upload.single('cover'), async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, status } = req.body;
  const cover = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // If a new cover image is uploaded, update it too
    const result = await pool.query(
      `UPDATE books 
       SET title = $1, author = $2, genre = $3, status = $4${cover ? ', cover = $6' : ''} 
       WHERE id = $5 
       RETURNING *`,
      cover
        ? [title, author, genre, status, id, cover]
        : [title, author, genre, status, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in PUT /books/:id:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// DELETE a book by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
    res.send('Book deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
