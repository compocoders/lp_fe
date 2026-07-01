const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'ClassroomDetail.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace(
  /className="p\.5 md:opacity-0 md:group-hover:opacity-100 rounded-lg border-none cursor-pointer bg-transparent transition-all text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900\/20 hover:text-red-500 dark:hover:text-red-400"/g,
  'className="p-1.5 rounded-lg border-none cursor-pointer bg-transparent transition-all text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400"'
);

content = content.replace(
  /className="p-1\.5 md:opacity-0 md:group-hover:opacity-100/g,
  'className="p-1.5'
);


fs.writeFileSync(filePath, content);
console.log("Made buttons always visible!");
