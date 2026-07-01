import React from 'react';
import { Mail, MessageSquare, MapPin, Phone } from 'lucide-react';
import PublicPageLayout from './PublicPageLayout';
import InteractiveCard from '../../components/common/InteractiveCard';
import { motion } from 'framer-motion';

const ContactPage = () => {
  return (
    <PublicPageLayout 
      title="Contact Us" 
      subtitle="We'd love to hear from you."
      icon={<MessageSquare className="w-4 h-4" />}
      wideContent={true}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Left column: info cards */}
        <div className="space-y-4 sm:space-y-6">
          <InteractiveCard title="Get in Touch" delay={0.1}>
            <p>
              Whether you have a question about features, pricing, need a demo, or anything else, our team is ready to answer all your questions.
            </p>
          </InteractiveCard>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
            <InteractiveCard delay={0.2} icon={<Mail className="w-5 h-5 sm:w-6 sm:h-6" />}>
              <h4 className="text-gray-900 font-bold mb-1 text-base sm:text-lg">Email Us</h4>
              <a href="mailto:support@likha.example.com" className="text-[#5D7C59] font-semibold hover:text-[#4A6447] transition-colors block text-sm sm:text-base break-all">support@likha.example.com</a>
            </InteractiveCard>
            
            <InteractiveCard delay={0.3} icon={<Phone className="w-5 h-5 sm:w-6 sm:h-6" />}>
              <h4 className="text-gray-900 font-bold mb-1 text-base sm:text-lg">Call Us</h4>
              <a href="tel:+1234567890" className="text-[#5D7C59] font-semibold hover:text-[#4A6447] transition-colors block text-sm sm:text-base">+1 (234) 567-890</a>
            </InteractiveCard>
            
            <InteractiveCard delay={0.4} icon={<MapPin className="w-5 h-5 sm:w-6 sm:h-6" />}>
              <h4 className="text-gray-900 font-bold mb-1 text-base sm:text-lg">Visit Us</h4>
              <p className="text-gray-600 text-sm sm:text-base">123 Innovation Drive, Tech City, TC 90210</p>
            </InteractiveCard>
          </div>
        </div>

        {/* Right column: form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="lg:sticky lg:top-32"
        >
          <div className="bg-white border border-gray-100 p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] flex flex-col gap-5 sm:gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#7A9A7B]/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#FFC700]/10 rounded-full blur-[60px] pointer-events-none" />
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Send a Message</h3>
            
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="text-gray-700 text-sm font-bold mb-1.5 sm:mb-2 block ml-1">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-[#FAFCFA] border-2 border-gray-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-gray-900 focus:outline-none focus:border-[#5D7C59] focus:bg-white transition-all font-medium hover:border-gray-200 text-sm sm:text-base"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-1.5 sm:mb-2 block ml-1">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-[#FAFCFA] border-2 border-gray-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-gray-900 focus:outline-none focus:border-[#5D7C59] focus:bg-white transition-all font-medium hover:border-gray-200 text-sm sm:text-base"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-bold mb-1.5 sm:mb-2 block ml-1">Message</label>
                <textarea 
                  className="w-full bg-[#FAFCFA] border-2 border-gray-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-gray-900 focus:outline-none focus:border-[#5D7C59] focus:bg-white transition-all h-28 sm:h-36 resize-none font-medium hover:border-gray-200 text-sm sm:text-base"
                  placeholder="How can we help you today?"
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#FFC700] text-gray-900 px-6 sm:px-8 py-4 sm:py-5 rounded-[1.25rem] font-extrabold hover:bg-[#FFD633] transition-all duration-300 shadow-[0_0_20px_rgba(255,199,0,0.3)] hover:shadow-[0_0_30px_rgba(255,199,0,0.5)] border border-[#FFC700] w-full text-base sm:text-lg uppercase tracking-wide"
              type="button"
            >
              Send Message
            </motion.button>
          </div>
        </motion.div>
      </div>
    </PublicPageLayout>
  );
};

export default ContactPage;
