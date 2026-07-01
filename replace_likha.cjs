const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'c:/projects/learningPlatform/lp_fe/src/components/classroom/ClassroomIdeaSpark.jsx',
  'c:/projects/learningPlatform/lp_fe/src/components/common/Footer.jsx',
  'c:/projects/learningPlatform/lp_fe/src/components/dashboard/Sidebar.jsx',
  'c:/projects/learningPlatform/lp_fe/src/pages/dashboard/AiStudioPage.jsx',
  'c:/projects/learningPlatform/lp_fe/src/pages/dashboard/ClassroomDetail.jsx',
  'c:/projects/learningPlatform/lp_fe/src/pages/dashboard/Mainpage.jsx',
  'c:/projects/learningPlatform/lp_fe/src/pages/dashboard/Settings.jsx',
  'c:/projects/learningPlatform/lp_fe/src/pages/LandingPage/LandingPage.jsx',
  'c:/projects/learningPlatform/lp_fe/src/pages/public/CareersPage.jsx',
  'c:/projects/learningPlatform/lp_fe/src/pages\public/ContactPage.jsx',
  'c:/projects/learningPlatform/lp_fe/src/pages/public/FeaturesPage.jsx',
  'c:/projects/learningPlatform/lp_fe/src/pages/public/PublicPageLayout.jsx'
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace text nodes
    content = content.replace(/>\s*(LIKHA|LIKHÂ|Likhā|Likhâ|Likha)\s*</g, '>L I K H Â<');
    content = content.replace(/"LIKHA"|"LIKHÂ"|"Likhā"|"Likhâ"|"Likha"/g, '"L I K H Â"');
    content = content.replace(/'LIKHA'|'LIKHÂ'|'Likhā'|'Likhâ'|'Likha'/g, "'L I K H Â'");
    
    // Replace within text (like "Likhâ AI Studio")
    content = content.replace(/(?<=[\s>"])LIKHA|LIKHÂ|Likhā|Likhâ|Likha(?=[\s<"])/g, 'L I K H Â');
    
    // In LandingPage, there's `Likhā` 
    content = content.replace(/Likhā/g, 'L I K H Â');
    content = content.replace(/Likhâ/g, 'L I K H Â');
    content = content.replace(/LIKHÂ/g, 'L I K H Â');
    content = content.replace(/LIKHA/g, 'L I K H Â');
    content = content.replace(/Likha/g, 'L I K H Â');

    // Revert back any accidentally broken component/variable names like L I K H ÂLogo or likhaLogo
    // Wait, the above is too aggressive. It might break `className="likha-logo"` or something.
    // So let's restore some specific things just in case:
    content = content.replace(/L I K H ÂLogo/g, 'LikhaLogo');
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${path.basename(file)}`);
  }
});
