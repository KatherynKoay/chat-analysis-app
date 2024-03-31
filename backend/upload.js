const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const analyzeChatLog = require("./analyzeChatLog"); // Import the script for analyzing chat log

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  try {
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

      // Find the chattiest user
      let chattiestUser = { username: "", count: 0 };
      for (const [username, count] of Object.entries(wordCounts)) {
        if (count > chattiestUser.count) {
          chattiestUser = { username, count };
        }
      }

      res.json(chattiestUser);
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send("Error processing file");
  }
});

module.exports = router;
