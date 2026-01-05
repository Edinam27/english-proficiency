const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a file path');
  process.exit(1);
}

try {
  const content = fs.readFileSync(filePath, 'utf8');
  // Simple regex to match <w:t> content. 
  // Note: This is a rough extraction.
  const regex = /<w:t[^>]*>(.*?)<\/w:t>/g;
  let match;
  let text = '';
  
  while ((match = regex.exec(content)) !== null) {
    text += match[1] + ' ';
  }
  
  console.log(text);
} catch (err) {
  console.error('Error reading file:', err);
}
