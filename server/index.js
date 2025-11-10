import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const BOOKS_FILE = path.join(__dirname, '../src/data/books.json');

app.use(cors());
app.use(express.json());

// Get all books
app.get('/api/books', (req, res) => {
  try {
    const data = fs.readFileSync(BOOKS_FILE, 'utf8');
    const books = JSON.parse(data);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read books' });
  }
});

// Update all books (for add, edit, delete operations)
app.post('/api/books', (req, res) => {
  try {
    const books = req.body;
    fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 3));
    res.json({ success: true, message: 'Books updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update books' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
