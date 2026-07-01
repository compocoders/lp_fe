import React from 'react';
import { Globe, Briefcase, Heart, Lightbulb, Zap } from 'lucide-react';
import PublicPageLayout from './PublicPageLayout';
import InteractiveCard from '../../components/common/InteractiveCard';

const CareersPage = () => {
  return (
    <PublicPageLayout 
      title="Careers" 
      subtitle="Join us in shaping the future of education."
      icon={<Globe className="w-4 h-4" />}
    >
      <InteractiveCard title="Work With Us" icon={<Briefcase className="w-6 h-6" />} delay={0.1}>
        <p>
          At L I K H Â, we are always looking for passionate, talented individuals to join our team. If you are excited about education and technology, we want to hear from you.
        </p>
      </InteractiveCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
        <InteractiveCard title="Impact" icon={<Heart className="w-6 h-6" />} delay={0.2}>
          <p>Your work will directly improve the educational experience of students worldwide.</p>
        </InteractiveCard>
        
        <InteractiveCard title="Innovation" icon={<Lightbulb className="w-6 h-6" />} delay={0.3}>
          <p>Work with cutting-edge technologies, including AI and machine learning.</p>
        </InteractiveCard>

        <InteractiveCard title="Culture" icon={<Globe className="w-6 h-6" />} delay={0.4}>
          <p>Join a collaborative, inclusive, and supportive team environment.</p>
        </InteractiveCard>

        <InteractiveCard title="Growth" icon={<Zap className="w-6 h-6" />} delay={0.5}>
          <p>Opportunities for professional development and career advancement.</p>
        </InteractiveCard>
      </div>

      <InteractiveCard title="Open Positions" delay={0.6}>
        <p>
          Currently, we are not actively hiring, but we are always open to connecting with great talent. Feel free to send your resume to <a href="mailto:careers@likha.example.com" className="text-[#5D7C59] hover:underline break-all">careers@likha.example.com</a>.
        </p>
      </InteractiveCard>
    </PublicPageLayout>
  );
};

export default CareersPage;
