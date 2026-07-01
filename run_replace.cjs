const fs = require('fs');
let content = fs.readFileSync('src/components/classroom/CreateActivityModal.jsx', 'utf8');
const startIndex = content.indexOf('{/* Scrollable form */}');
const endIndexStrWin = '          </div>\r\n        </div>\r\n      )}\r\n    </div>';
let endIndex = content.indexOf('          </div>\n        </div>\n      )}\n    </div>');
if (endIndex === -1) endIndex = content.indexOf(endIndexStrWin);

let scriptContent = fs.readFileSync('replace_ui.cjs', 'utf8');
let newContent = scriptContent.substring(scriptContent.indexOf('`') + 1, scriptContent.lastIndexOf('`'));

if (startIndex === -1 || endIndex === -1) {
  console.log('Error finding indices', startIndex, endIndex);
  process.exit(1);
}

const newFileContent = content.substring(0, startIndex) + newContent + '\n' + content.substring(endIndex);
fs.writeFileSync('src/components/classroom/CreateActivityModal.jsx', newFileContent, 'utf8');
console.log('UI Replace Success');
