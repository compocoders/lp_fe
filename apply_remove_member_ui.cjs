const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'ClassroomDetail.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const leftTarget = `{member.role === 'OWNER' && (
              <span className="text-[10px] font-bold bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 text-[#5D7C59] dark:text-[#7A9A7B] px-2.5 py-1 rounded-full">Teacher</span>
            )}`;
            
const leftReplace = `{member.role === 'OWNER' && (
              <span className="text-[10px] font-bold bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 text-[#5D7C59] dark:text-[#7A9A7B] px-2.5 py-1 rounded-full">Teacher</span>
            )}
            {isTeacher && member.role !== 'OWNER' && (
              <button
                onClick={(e) => { e.stopPropagation(); handleRemoveMember(member.userId); }}
                disabled={removingMemberId === member.userId}
                className="p-1.5 md:opacity-0 md:group-hover:opacity-100 rounded-lg border-none cursor-pointer bg-transparent transition-all text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400"
                title="Remove member"
              >
                {removingMemberId === member.userId ? <Loader2 size={14} className="animate-spin" /> : <X size={15} strokeWidth={2.5} />}
              </button>
            )}`;

const leftItemTarget = `className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/[0.02] backdrop-blur-md border border-gray-100 dark:border-white/10 rounded-xl hover:bg-white/80 dark:hover:bg-white/[0.04] hover:border-[#5D7C59]/30 dark:hover:border-[#7A9A7B]/40 hover:shadow-sm dark:hover:shadow-none transition-all cursor-pointer">`;
const leftItemReplace = `className="group flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/[0.02] backdrop-blur-md border border-gray-100 dark:border-white/10 rounded-xl hover:bg-white/80 dark:hover:bg-white/[0.04] hover:border-[#5D7C59]/30 dark:hover:border-[#7A9A7B]/40 hover:shadow-sm dark:hover:shadow-none transition-all cursor-pointer">`;

const rightTarget = `{member.role === 'OWNER' && (
                  <span className="text-[10px] font-bold bg-[#FFC700]/15 dark:bg-[#FFC700]/25 text-[#4A6447] dark:text-[#FFC700] px-2.5 py-1 rounded-full shrink-0">Owner</span>
                )}`;

const rightReplace = `{member.role === 'OWNER' && (
                  <span className="text-[10px] font-bold bg-[#FFC700]/15 dark:bg-[#FFC700]/25 text-[#4A6447] dark:text-[#FFC700] px-2.5 py-1 rounded-full shrink-0">Owner</span>
                )}
                {isTeacher && member.role !== 'OWNER' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemoveMember(member.userId); }}
                    disabled={removingMemberId === member.userId}
                    className="p-1.5 md:opacity-0 md:group-hover:opacity-100 rounded-lg border-none cursor-pointer bg-transparent transition-all text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 shrink-0"
                    title="Remove member"
                  >
                    {removingMemberId === member.userId ? <Loader2 size={13} className="animate-spin" /> : <X size={14} strokeWidth={2.5} />}
                  </button>
                )}`;
                
const rightItemTarget = `className="flex items-center gap-3 p-3.5 bg-[#FAFCFA] dark:bg-[#232B23] border border-gray-100 dark:border-white/5 rounded-xl hover:border-[#5D7C59]/30 dark:hover:border-[#7A9A7B]/40 hover:-translate-y-0.5 hover:shadow-sm dark:hover:shadow-none transition-all cursor-pointer">`;
const rightItemReplace = `className="group flex items-center gap-3 p-3.5 bg-[#FAFCFA] dark:bg-[#232B23] border border-gray-100 dark:border-white/5 rounded-xl hover:border-[#5D7C59]/30 dark:hover:border-[#7A9A7B]/40 hover:-translate-y-0.5 hover:shadow-sm dark:hover:shadow-none transition-all cursor-pointer">`;

// Remove whitespaces to reliably match
function clean(str) {
    return str.replace(/\s+/g, '');
}

if (clean(content).includes(clean(leftTarget))) {
    content = content.replace(leftTarget, leftReplace);
}

if (clean(content).includes(clean(rightTarget))) {
    content = content.replace(rightTarget, rightReplace);
}

content = content.replace(leftItemTarget, leftItemReplace);
content = content.replace(rightItemTarget, rightItemReplace);

fs.writeFileSync(filePath, content);
console.log("Done!");
