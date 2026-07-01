const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'ClassroomDetail.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace left panel avatar
const leftTarget = `              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center text-white font-bold text-sm">
                {member.User?.profile?.firstName?.charAt(0)}{member.User?.profile?.lastName?.charAt(0)}
              </div>`;
const leftReplace = `              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0">
                {member.User?.profile?.profilePicture ? (
                  <img src={member.User.profile.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <>{member.User?.profile?.firstName?.charAt(0)}{member.User?.profile?.lastName?.charAt(0)}</>
                )}
              </div>`;

// Replace right panel avatar
const rightTarget = `                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {member.User?.profile?.firstName?.charAt(0)}{member.User?.profile?.lastName?.charAt(0)}
                  </div>`;
const rightReplace = `                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden shrink-0">
                    {member.User?.profile?.profilePicture ? (
                      <img src={member.User.profile.profilePicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <>{member.User?.profile?.firstName?.charAt(0)}{member.User?.profile?.lastName?.charAt(0)}</>
                    )}
                  </div>`;

if (content.includes(leftTarget) && content.includes(rightTarget)) {
  content = content.replace(leftTarget, leftReplace);
  content = content.replace(rightTarget, rightReplace);
  fs.writeFileSync(filePath, content);
  console.log("Avatars replaced successfully!");
} else {
  console.log("Could not find targets.");
  if (!content.includes(leftTarget)) console.log("Left target not found.");
  if (!content.includes(rightTarget)) console.log("Right target not found.");
}
