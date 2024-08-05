const fs = require('fs');
const path = require('path');

// Path to the bannedlist.txt file
const txtFilePath = path.join(__dirname, 'public', 'bannedlist.txt');
// Path to the output bannedlist.json file
const jsonFilePath = path.join(__dirname, 'public', 'bannedlist.json');

// Read the contents of bannedlist.txt
fs.readFile(txtFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading bannedlist.txt:', err);
    return;
  }

  // Split the contents by newline to get an array of banned words
  const bannedWords = data.split('\n').map(word => word.trim()).filter(word => word.length > 0);

  // Convert the array to JSON format
  const jsonContent = JSON.stringify(bannedWords, null, 2);

  // Write the JSON content to bannedlist.json
  fs.writeFile(jsonFilePath, jsonContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing bannedlist.json:', err);
      return;
    }

    console.log('bannedlist.json has been created successfully.');
  });
});
