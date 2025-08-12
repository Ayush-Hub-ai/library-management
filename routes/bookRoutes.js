const express = require('express');
const router = express.Router();
const Book = require('../models/Book.js');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// GET all books (Public Route)
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({}).populate('borrowedBy', 'name email');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- ADD THIS ROUTE ---
// GET a single book by ID (Public Route)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE a new book (Admin Only)
router.post('/', protect, isAdmin, async (req, res) => {
  // ... your existing create logic ...
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a book's details (Admin Only)
router.put('/:id', protect, isAdmin, async (req, res) => {
  // ... your existing update logic ...
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a book (Admin Only)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  // ... your existing delete logic ...
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ISSUE a book to a specific user (Admin Only)
router.post('/:id/issue', protect, isAdmin, async (req, res) => {
  // ... your existing issue logic ...
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required to issue a book.' });
    }
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.status === 'Issued') {
      return res.status(400).json({ message: 'Book is already issued' });
    }
    book.borrowedBy = userId;
    book.status = 'Issued';
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    book.dueDate = dueDate;
    await book.save();
    const populatedBook = await Book.findById(book._id).populate('borrowedBy', 'name email');
    res.json({ message: 'Book issued successfully', book: populatedBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// RETURN a book (Admin Only)
router.post('/:id/return', protect, isAdmin, async (req, res) => {
  // ... your existing return logic ...
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.status === 'Available') {
      return res.status(400).json({ message: 'Book is already available' });
    }
    book.borrowedBy = null;
    book.status = 'Available';
    book.dueDate = null;
    await book.save();
    res.json({ message: 'Book returned successfully', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;