const fs = require('fs');
let content = fs.readFileSync('src/components/classroom/CreateActivityModal.jsx', 'utf8');
content = content.split('\\`').join('`');
content = content.split('\\$').join('$');
fs.writeFileSync('src/components/classroom/CreateActivityModal.jsx', content, 'utf8');
console.log('Fixed syntax error');
