import React from 'react';
import { FileSignature, ShieldAlert, XCircle, RefreshCw } from 'lucide-react';
import PublicPageLayout from './PublicPageLayout';
import InteractiveCard from '../../components/common/InteractiveCard';

const TermsOfServicePage = () => {
  return (
    <PublicPageLayout 
      title="Terms of Service" 
      subtitle="Please read these terms carefully before using our platform."
      icon={<FileSignature className="w-4 h-4" />}
    >
      <p className="text-sm text-[#FFC700] mb-8 font-semibold">Last Updated: October 2023</p>

      <InteractiveCard title="1. Terms" delay={0.1}>
        <p>
          By accessing the website at Likhā, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </p>
      </InteractiveCard>

      <InteractiveCard title="2. Use License" icon={<ShieldAlert className="w-6 h-6" />} delay={0.2}>
        <p className="mb-4">
          Permission is granted to temporarily download one copy of the materials (information or software) on Likhā's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul className="space-y-4 mb-4">
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700] mt-2 flex-shrink-0" />
            <div>modify or copy the materials;</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700] mt-2 flex-shrink-0" />
            <div>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700] mt-2 flex-shrink-0" />
            <div>attempt to decompile or reverse engineer any software contained on Likhā's website;</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700] mt-2 flex-shrink-0" />
            <div>remove any copyright or other proprietary notations from the materials; or</div>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700] mt-2 flex-shrink-0" />
            <div>transfer the materials to another person or "mirror" the materials on any other server.</div>
          </li>
        </ul>
        <p>
          This license shall automatically terminate if you violate any of these restrictions and may be terminated by Likhā at any time.
        </p>
      </InteractiveCard>

      <InteractiveCard title="3. Disclaimer" delay={0.3}>
        <p>
          The materials on Likhā's website are provided on an 'as is' basis. Likhā makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
      </InteractiveCard>

      <InteractiveCard title="4. Limitations" icon={<XCircle className="w-6 h-6" />} delay={0.4}>
        <p>
          In no event shall Likhā or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Likhā's website, even if Likhā or a Likhā authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>
      </InteractiveCard>

      <InteractiveCard title="5. Revisions and Errata" icon={<RefreshCw className="w-6 h-6" />} delay={0.5}>
        <p>
          The materials appearing on Likhā's website could include technical, typographical, or photographic errors. Likhā does not warrant that any of the materials on its website are accurate, complete or current. Likhā may make changes to the materials contained on its website at any time without notice.
        </p>
      </InteractiveCard>
    </PublicPageLayout>
  );
};

export default TermsOfServicePage;
