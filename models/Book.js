// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  // --- NEW FIELDS ---
  status: {
    type: String,
    enum: ['Available', 'Issued'], // Status can only be one of these two values
    default: 'Available',        // New books are 'Available' by default
  },
  borrowedBy: {
    type: mongoose.Schema.Types.ObjectId, // Links to a User's ID
    ref: 'User',                          // The User model
    default: null,
  },
  dueDate: {
    type: Date,
    default: null,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;