// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import the 'path' module

const app = express();

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies in requests

// Serve static files (like HTML, CSS, and uploaded images)
// This makes your 'public' and 'uploads' folders accessible from the browser
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- API Routes ---

// Import your route files
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); // Assuming you have this file

// Use the routes with a base path
app.use('/api/books', bookRoutes); // All book-related routes will start with /api/books
app.use('/api/users', userRoutes); // All user-related routes will start with /api/users
app.use('/api', uploadRoutes);     // The upload route can be /api/upload

// Example root route
app.get('/', (req, res) => {
    res.send('Library Management System Backend is running...');
});

// --- Server Listening ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});