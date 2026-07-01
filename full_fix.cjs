const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'ClassroomDetail.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add removeMember to imports
if (!content.includes('removeMember')) {
    content = content.replace(
        "import { getClassroomByCode } from '../../api/classroom.api';",
        "import { getClassroomByCode, removeMember } from '../../api/classroom.api';"
    );
}

// 2. Add removingMemberId state and handleRemoveMember function
if (!content.includes('removingMemberId')) {
    const targetState = `  const [togglingActivityId, setTogglingActivityId] = useState(null);`;
    const replaceState = `  const [togglingActivityId, setTogglingActivityId] = useState(null);
  const [removingMemberId, setRemovingMemberId] = useState(null);

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member from the classroom?")) return;
    setRemovingMemberId(memberId);
    try {
      await removeMember(classroom.id, memberId);
      setClassroom(prev => ({
        ...prev,
        classroomUsers: prev.classroomUsers.filter(u => u.userId !== memberId)
      }));
      toast.success('Member removed successfully');
    } catch (e) {
      console.error('Failed to remove member', e);
      toast.error(e?.response?.data?.message || 'Failed to remove member');
    } finally {
      setRemovingMemberId(null);
    }
  };`;
    content = content.replace(targetState, replaceState);
}

// 3. Left Panel Button & Avatars
const leftTargetRegex = /\{member\.role === 'OWNER' && \(\s*<span className="text-\[10px\] font-bold bg-\[#5D7C59\]\/10 dark:bg-\[#5D7C59\]\/20 text-\[#5D7C59\] dark:text-\[#7A9A7B\] px-2\.5 py-1 rounded-full">Teacher<\/span>\s*\)\}\s*<\/div>/g;

content = content.replace(leftTargetRegex, `{member.role === 'OWNER' && (
              <span className="text-[10px] font-bold bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 text-[#5D7C59] dark:text-[#7A9A7B] px-2.5 py-1 rounded-full">Teacher</span>
            )}
            {isTeacher && member.role !== 'OWNER' && (
              <button
                onClick={(e) => { e.stopPropagation(); handleRemoveMember(member.userId); }}
                disabled={removingMemberId === member.userId}
                className="p-1.5 rounded-lg border-none cursor-pointer bg-transparent transition-all text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400"
                title="Remove member"
              >
                {removingMemberId === member.userId ? <Loader2 size={14} className="animate-spin" /> : <X size={15} strokeWidth={2.5} />}
              </button>
            )}
          </div>`);

// 4. Right Panel Button & Avatars
const rightTargetRegex = /\{member\.role === 'OWNER' && \(\s*<span className="text-\[10px\] font-bold bg-\[#FFC700\]\/15 dark:bg-\[#FFC700\]\/25 text-\[#4A6447\] dark:text-\[#FFC700\] px-2\.5 py-1 rounded-full shrink-0">Owner<\/span>\s*\)\}\s*<\/div>/g;

content = content.replace(rightTargetRegex, `{member.role === 'OWNER' && (
                  <span className="text-[10px] font-bold bg-[#FFC700]/15 dark:bg-[#FFC700]/25 text-[#4A6447] dark:text-[#FFC700] px-2.5 py-1 rounded-full shrink-0">Owner</span>
                )}
                {isTeacher && member.role !== 'OWNER' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemoveMember(member.userId); }}
                    disabled={removingMemberId === member.userId}
                    className="p-1.5 rounded-lg border-none cursor-pointer bg-transparent transition-all text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 shrink-0"
                    title="Remove member"
                  >
                    {removingMemberId === member.userId ? <Loader2 size={13} className="animate-spin" /> : <X size={14} strokeWidth={2.5} />}
                  </button>
                )}
              </div>`);

// 5. ClassroomDetailsModal isTeacher prop
const modalTargetRegex = /<ClassroomDetailsModal\s*isOpen=\{showDetailsModal\}\s*onClose=\{\(\) => setShowDetailsModal\(false\)\}\s*classroom=\{classroom\}\s*onUpdateClick=\{\(\) => \{ setShowDetailsModal\(false\); setShowUpdateModal\(true\); \}\}\s*\/>/g;
content = content.replace(modalTargetRegex, `<ClassroomDetailsModal
              isOpen={showDetailsModal}
              onClose={() => setShowDetailsModal(false)}
              classroom={classroom}
              isTeacher={isTeacher}
              onUpdateClick={() => { setShowDetailsModal(false); setShowUpdateModal(true); }}
            />`);

// 6. Avatars Fix
content = content.replace(
  /\{member\.User\?\.profile\?\.firstName\?\.charAt\(0\)\}\{member\.User\?\.profile\?\.lastName\?\.charAt\(0\)\}/g,
  `{member.User?.profile?.profilePicture ? (
                  <img src={member.User.profile.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <>{member.User?.profile?.firstName?.charAt(0)}{member.User?.profile?.lastName?.charAt(0)}</>
                )}`
);

content = content.replace(
  /className="w-9 h-9 rounded-full bg-gradient-to-br from-\[#5D7C59\] to-\[#4A6447\] flex items-center justify-center text-white font-bold text-sm"/g,
  'className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0"'
);

content = content.replace(
  /className="w-10 h-10 rounded-full bg-gradient-to-br from-\[#5D7C59\] to-\[#4A6447\] flex items-center justify-center text-white font-bold text-sm shadow-sm"/g,
  'className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden shrink-0"'
);

fs.writeFileSync(filePath, content);
console.log("All UI fixes applied successfully via regex!");
