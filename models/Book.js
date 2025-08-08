const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  publishedYear: Number,
  available: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Book', bookSchema);
