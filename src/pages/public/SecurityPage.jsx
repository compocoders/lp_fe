import React from 'react';
import { Shield, Lock, Key, Activity, CheckCircle } from 'lucide-react';
import PublicPageLayout from './PublicPageLayout';
import InteractiveCard from '../../components/common/InteractiveCard';

const SecurityPage = () => {
  return (
    <PublicPageLayout 
      title="Security" 
      subtitle="Your data's safety is our top priority."
      icon={<Shield className="w-4 h-4" />}
    >
      <InteractiveCard title="Enterprise-Grade Security" icon={<Shield className="w-6 h-6" />} delay={0.1}>
        <p>
          At Likhā, we take the security of your data seriously. We employ industry-standard security measures to ensure that your information is safe and secure at all times.
        </p>
      </InteractiveCard>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
        <InteractiveCard title="Data Encryption" icon={<Lock className="w-6 h-6" />} delay={0.2}>
          <p>
            All data transmitted between your device and our servers is encrypted using TLS (Transport Layer Security). Data at rest is encrypted using AES-256 encryption.
          </p>
        </InteractiveCard>

        <InteractiveCard title="Authentication & Authorization" icon={<Key className="w-6 h-6" />} delay={0.3}>
          <p>
            We use secure authentication mechanisms to verify user identities. Access controls ensure that users only have access to the data they are authorized to see.
          </p>
        </InteractiveCard>

        <InteractiveCard title="Continuous Monitoring" icon={<Activity className="w-6 h-6" />} delay={0.4}>
          <p>
            Our systems are continuously monitored for suspicious activity. We employ automated threat detection and response mechanisms to address potential security incidents promptly.
          </p>
        </InteractiveCard>
        
        <InteractiveCard title="Compliance" icon={<CheckCircle className="w-6 h-6" />} delay={0.5}>
          <p>
            We comply with major data protection regulations, ensuring that your data is handled responsibly and ethically.
          </p>
        </InteractiveCard>
      </div>
    </PublicPageLayout>
  );
};

export default SecurityPage;
