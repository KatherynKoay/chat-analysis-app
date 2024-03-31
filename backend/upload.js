const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  fs.readFile(req.file.path, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }

    const wordCounts = {};
    const lines = data.split("\n");
    lines.forEach((line) => {
      const words = line.split(" ");
      const username = words[0];
      wordCounts[username] = (wordCounts[username] || 0) + words.length;
    });

    const users = Object.keys(wordCounts).map((username) => ({
      username,
      count: wordCounts[username],
    }));

    users.sort((a, b) => b.count - a.count);

    res.json(users);
  });
});

module.exports = router;
