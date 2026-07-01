const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'AiStudioPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const badButtons = `          {[
            { key: 'summary', label: 'Create Summary', icon: ScrollText },
            { key: 'reviewer', label: 'Create Reviewer', icon: Brain },
            { key: 'overview', label: 'Create Overview', icon: Layers },
          ].map(({ key, label, icon: Icon }) => (`;

const goodButtons = `          {[
            { key: 'notes', label: 'Create Notes', icon: ScrollText },
            { key: 'quiz', label: 'Create Quiz', icon: Brain },
          ].map(({ key, label, icon: Icon }) => (`;

if (content.includes(badButtons)) {
  content = content.replace(badButtons, goodButtons);
  fs.writeFileSync(filePath, content);
  console.log("Fixed AiStudioPage sidebar buttons successfully.");
} else {
  console.log("Could not find the bad buttons to replace.");
}
