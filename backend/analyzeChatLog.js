const fs = require("fs");

function getChattiestUsers(filePath, k) {
  // Read the contents of the file
  const data = fs.readFileSync(filePath, "utf8");

  // Initialize an object to store word counts for each user
  const wordCounts = {};

  // Split the data into lines
  const lines = data.split("\n");

  // Iterate over each line
  lines.forEach((line) => {
    // Extract the username using regex
    const match = line.match(/<([^>]+)>/);
    if (match && match[1]) {
      const username = match[1];
      // Count the number of words in the line
      const words = line.split(/\s+/).length;
      // Update word count for the user
      wordCounts[username] = (wordCounts[username] || 0) + words;
    }
  });

  // Convert wordCounts object to an array of objects
  const users = Object.keys(wordCounts).map((username) => ({
    username,
    count: wordCounts[username],
  }));

  // Sort the users by count in descending order
  users.sort((a, b) => b.count - a.count);

  // Return the top k chattiest users
  return users.slice(0, k);
}

// Example usage:
const filePath = "logfile.txt";
const k = 3; // Change k to the desired number
const topUsers = getChattiestUsers(filePath, k);
console.log(`Top ${k} chattiest users:`);
topUsers.forEach((user, index) => {
  console.log(`${index + 1}. ${user.username}: ${user.count} words`);
});
