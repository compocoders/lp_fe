import React from 'react';
import { FileText, Database, Lock, UserCheck } from 'lucide-react';
import PublicPageLayout from './PublicPageLayout';
import InteractiveCard from '../../components/common/InteractiveCard';

const PrivacyPolicyPage = () => {
  return (
    <PublicPageLayout 
      title="Privacy Policy" 
      subtitle="How we collect, use, and protect your data."
      icon={<FileText className="w-4 h-4" />}
    >
      <p className="text-sm text-[#FFC700] mb-8 font-semibold">Last Updated: October 2023</p>

      <InteractiveCard title="1. Introduction" delay={0.1}>
        <p>
          Welcome to Likhā. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
        </p>
      </InteractiveCard>

      <InteractiveCard title="2. Data We Collect" icon={<Database className="w-6 h-6" />} delay={0.2}>
        <p className="mb-4">
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
        </p>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700] mt-2 flex-shrink-0" />
            <div><strong className="text-gray-900">Identity Data:</strong> includes first name, last name, username or similar identifier.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700] mt-2 flex-shrink-0" />
            <div><strong className="text-gray-900">Contact Data:</strong> includes email address and telephone numbers.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700] mt-2 flex-shrink-0" />
            <div><strong className="text-gray-900">Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700] mt-2 flex-shrink-0" />
            <div><strong className="text-gray-900">Usage Data:</strong> includes information about how you use our website, products and services.</div>
          </li>
        </ul>
      </InteractiveCard>

      <InteractiveCard title="3. How We Use Your Data" icon={<UserCheck className="w-6 h-6" />} delay={0.3}>
        <p className="mb-4">
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </p>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700] mt-2 flex-shrink-0" />
            <div>Where we need to perform the contract we are about to enter into or have entered into with you.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700] mt-2 flex-shrink-0" />
            <div>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700] mt-2 flex-shrink-0" />
            <div>Where we need to comply with a legal obligation.</div>
          </li>
        </ul>
      </InteractiveCard>

      <InteractiveCard title="4. Data Security" icon={<Lock className="w-6 h-6" />} delay={0.4}>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
        </p>
      </InteractiveCard>

      <InteractiveCard title="5. Your Legal Rights" delay={0.5}>
        <p>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
        </p>
      </InteractiveCard>
    </PublicPageLayout>
  );
};

export default PrivacyPolicyPage;
