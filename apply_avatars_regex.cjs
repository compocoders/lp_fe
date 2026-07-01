const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'ClassroomDetail.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// The block starts with <div className="... flex items-center justify-center text-white font-bold text-sm...
// and contains {member.User?.profile?.firstName?.charAt(0)}{member.User?.profile?.lastName?.charAt(0)}
// Let's replace the inner part

content = content.replace(
  /\{member\.User\?\.profile\?\.firstName\?\.charAt\(0\)\}\{member\.User\?\.profile\?\.lastName\?\.charAt\(0\)\}/g,
  `{member.User?.profile?.profilePicture ? (
                  <img src={member.User.profile.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <>{member.User?.profile?.firstName?.charAt(0)}{member.User?.profile?.lastName?.charAt(0)}</>
                )}`
);

// We also need to add overflow-hidden shrink-0 to the parent div
content = content.replace(
  /className="w-9 h-9 rounded-full bg-gradient-to-br from-\[#5D7C59\] to-\[#4A6447\] flex items-center justify-center text-white font-bold text-sm"/g,
  'className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0"'
);

content = content.replace(
  /className="w-10 h-10 rounded-full bg-gradient-to-br from-\[#5D7C59\] to-\[#4A6447\] flex items-center justify-center text-white font-bold text-sm shadow-sm"/g,
  'className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden shrink-0"'
);

fs.writeFileSync(filePath, content);
console.log("Avatars replaced using regex!");
