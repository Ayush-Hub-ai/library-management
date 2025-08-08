// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// ✅ Ensure directories exist
function ensureDirExist(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// ✅ Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const bookPath = path.join(__dirname, '..', 'uploads', 'books');
    const coverPath = path.join(__dirname, '..', 'uploads', 'covers');

    if (file.fieldname === 'book') {
      ensureDirExist(bookPath);
      cb(null, bookPath);
    } else if (file.fieldname === 'cover') {
      ensureDirExist(coverPath);
      cb(null, coverPath);
    } else {
      cb(new Error("Invalid field name"));
    }
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ POST route
router.post('/', upload.fields([
  { name: 'book', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), (req, res) => {
  try {
    if (!req.files || !req.files.book || !req.files.cover) {
      return res.status(400).send("Both files required.");
    }

    console.log("✅ Book uploaded:", req.files.book[0].filename);
    console.log("✅ Cover uploaded:", req.files.cover[0].filename);
    
    res.send("✅ Files uploaded successfully!");
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).send("Upload failed.");
  }
});

module.exports = router;
