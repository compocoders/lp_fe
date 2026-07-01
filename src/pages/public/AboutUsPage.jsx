import React from 'react';
import { Users, History, Target, Eye, Star } from 'lucide-react';
import PublicPageLayout from './PublicPageLayout';
import InteractiveCard from '../../components/common/InteractiveCard';

const AboutUsPage = () => {
  return (
    <PublicPageLayout 
      title="About Us" 
      subtitle="We are on a mission to revolutionize education."
      icon={<Users className="w-4 h-4" />}
    >
      <InteractiveCard title="Our Story" icon={<History className="w-6 h-6" />} delay={0.1}>
        <p>
          Likhā started with a simple idea: education should be accessible, engaging, and personalized for everyone. We saw the limitations of traditional learning methods and set out to build a platform that empowers both educators and students.
        </p>
      </InteractiveCard>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
        <InteractiveCard title="Our Mission" icon={<Target className="w-6 h-6" />} delay={0.2}>
          <p>
            To democratize education by providing innovative, AI-driven tools that enhance the learning experience and foster a global community of lifelong learners.
          </p>
        </InteractiveCard>

        <InteractiveCard title="Our Vision" icon={<Eye className="w-6 h-6" />} delay={0.3}>
          <p>
            A world where everyone has the opportunity to unlock their full potential through high-quality, personalized education.
          </p>
        </InteractiveCard>
      </div>

      <InteractiveCard title="Our Values" icon={<Star className="w-6 h-6" />} delay={0.4}>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-[#5D7C59] mt-1.5 flex-shrink-0" />
            <div><strong className="text-gray-900">Innovation:</strong> We continuously push the boundaries of educational technology.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-[#5D7C59] mt-1.5 flex-shrink-0" />
            <div><strong className="text-gray-900">Inclusivity:</strong> We build tools that cater to diverse learning styles and needs.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-[#5D7C59] mt-1.5 flex-shrink-0" />
            <div><strong className="text-gray-900">Integrity:</strong> We are committed to data privacy and ethical AI practices.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-[#5D7C59] mt-1.5 flex-shrink-0" />
            <div><strong className="text-gray-900">Community:</strong> We believe in the power of collaboration and shared learning.</div>
          </li>
        </ul>
      </InteractiveCard>
    </PublicPageLayout>
  );
};

export default AboutUsPage;
